import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderFirebaseRepository } from '../OrderFeature/infrastructure/repositories/order-firebase.repository';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderDto } from '../OrderFeature/domain/entities/order.dto';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { UserService } from './user.service';
import { UserWithRole } from '../UserFeature/domain/entities/user-with-role';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]); // Now it holds an array of orders
  orders$ = this.ordersSubject.asObservable();

  currentUserWithRole: UserWithRole | null = null;

  constructor(
    private orderRepository: OrderFirebaseRepository,
    private userService: UserService
  ) {

    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
      this.listenForOrdersChanges(); // 🔥 Start listening for order updates on service initialization
    });
  }

  /** ✅ Listen for real-time updates on orders */
  private listenForOrdersChanges(): void {
    this.orderRepository.listenForAllOrdersChanges();
    this.orderRepository.order$.subscribe(orders => {
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
}
