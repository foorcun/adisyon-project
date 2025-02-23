import { Injectable } from '@angular/core';
import { GetAllOrdersUseCase } from '../OrderFeature/application/get-all-order.usecase';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { UpdateOrderStatusUseCase } from '../OrderFeature/application/update-order-status.usecase';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderPageFacadeService {

  private orders = new BehaviorSubject<Order[]>([]); // Holds the list of orders
  private orderSubject = new BehaviorSubject<Order | null>(null); // Tracks individual order updates

  constructor(
    private getAllOrdersUseCase: GetAllOrdersUseCase,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase
  ) {
    this.fetchAllOrders(); // Fetch all orders on service initialization
  }

  /**
   * Get all orders as an observable (initializes BehaviorSubject state).
   */
  fetchAllOrders(): void {
    this.getAllOrdersUseCase.execute().subscribe((orders) => {
      this.orders.next(orders);
    });
  }

  /**
   * Exposes the BehaviorSubject holding the list of orders as an observable.
   */
  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  /**
   * Updates the status of an order and refreshes BehaviorSubject.
   */
  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.updateOrderStatusUseCase
      .execute(orderId, status)
      .pipe(
        tap(() => {
          const currentOrders = this.orders.getValue();
          const updatedOrders = currentOrders.map(order => {
            if (order.id === orderId) {
              // order.updateStatus(status);
              order.status = status;
              return order;
            }
            return order;
          });
          this.orders.next(updatedOrders); // Update the order list
          const updatedOrder = updatedOrders.find(order => order.id === orderId) || null;
          this.orderSubject.next(updatedOrder); // Notify about the specific order update
        })
      )
      .subscribe({
        next: () => console.log(`Order ${orderId} status updated to ${status}`),
        error: (err) => console.error(`Failed to update order ${orderId}:`, err),
      });
  }

  /**
   * Exposes the BehaviorSubject tracking individual order updates as an observable.
   */
  getOrderUpdates(): Observable<Order | null> {
    return this.orderSubject.asObservable();
  }
}
