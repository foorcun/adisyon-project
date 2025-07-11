import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { OrderFirebaseRepository } from '../OrderFeature/infrastructure/repositories/order-firebase.repository';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderDto } from '../OrderFeature/domain/entities/order.dto';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { UserService } from './user.service';
import { UserWithRole } from '../UserFeature/domain/entities/user-with-role.entity';
import { LoggerService } from './logger.service';
import { BreadcrumbService } from './breadcrumb.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]); // Now it holds an array of orders
  orders$ = this.ordersSubject.asObservable();

  currentUserWithRole: UserWithRole | null = null;

  constructor(
    private orderRepository: OrderFirebaseRepository,
    private userService: UserService,
    private logger: LoggerService,
    private breadcrumbService: BreadcrumbService
  ) {

    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
      this.listenForOrdersChanges(); // 🔥 Start listening for order updates on service initialization
    });
  }

  /** ✅ Listen for real-time updates on orders */
  private listenForOrdersChanges(): void {
    this.orderRepository.listenForAllOrdersChanges();
    this.orderRepository.orders$.subscribe(orders => {
      if (orders) {
        // this.ordersSubject.next(orders.reduce((acc, order) => {
        //   acc[order.id] = order;
        //   return acc;
        // }, {} as { [key: string]: Order }));
        this.ordersSubject.next(orders);
      }
    });
  }

  // /** ✅ Get all orders as a dictionary */
  // getOrders(): { [key: string]: Order } {
  //   return this.ordersSubject.getValue();
  // }

  /** ✅ Get orders for a specific user */
  getUserOrders(userUid: string): Observable<Order[]> {
    return new Observable(observer => {
      this.orderRepository.getAllOrders().subscribe(orders => {
        const userOrders = orders.filter(order => order.userUid === userUid);
        observer.next(userOrders);
        observer.complete();
      });
    });
  }

  /** ✅ Create a new order */
  createOrder(order: OrderDto): Observable<string> {
    this.logger.log(`[OrderService] createOrder called with breadcrumb=${this.breadcrumbService.getBreadcrumbId()} order=${JSON.stringify(order)}`);
    return this.orderRepository.createOrder(order);
  }

  /** ✅ Update order status */
  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return this.orderRepository.updateOrderStatus(orderId, status);
  }

  /** ✅ Delete an order */
  deleteOrder(orderId: string): Observable<void> {
    return this.orderRepository.deleteOrder(orderId);
  }
  /** ✅ Close all orders for a specific table */
  closeOrdersForTable(tableId: string): Observable<void> {
    return new Observable(observer => {
      const allOrders = this.ordersSubject.getValue();
      const matchingOrders = allOrders.filter(order => order.tableUUID === tableId);

      if (matchingOrders.length === 0) {
        observer.next(); // nothing to close
        observer.complete();
        return;
      }

      let completedCount = 0;
      const totalToClose = matchingOrders.length;

      matchingOrders.forEach(order => {
        this.orderRepository.updateOrderStatus(order.id, 'closed' as OrderStatus).subscribe({
          next: () => {
            completedCount++;
            if (completedCount === totalToClose) {
              observer.next();
              observer.complete();
            }
          },
          error: (err) => {
            observer.error(err);
          }
        });
      });
    });
  }

  deleteOrdersByTableId(tableId: string): Observable<void> {
    this.logger.log(`[OrderService] deleteOrdersByTableId called with tableId=${tableId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);

    return this.orderRepository.orders$.pipe(
      map((orders: Order[]) => {
        const orderIds = orders
          .filter(order => order.tableUUID === tableId)
          .map(order => order.id);

        this.logger.log(`[OrderService] Found ${orderIds.length} orders to delete for table=${tableId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
        return orderIds;
      }),
      switchMap((orderIds: string[]) => {
        if (orderIds.length === 0) {
          this.logger.log(`[OrderService] No orders to delete for table=${tableId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
          return of(void 0);
        }

        const deletionObservables = orderIds.map(id => {
          this.logger.log(`[OrderService] Deleting order id=${id} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
          return this.orderRepository.deleteOrder(id);
        });

        return forkJoin(deletionObservables).pipe(
          map(() => {
            this.logger.log(`[OrderService] All orders deleted for table=${tableId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
            return void 0;
          })
        );
      })
    );
  }


}
