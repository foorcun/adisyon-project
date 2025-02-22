import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderRepository } from '../domain/repositories/order-repository';
import { OrderStatus } from '../domain/entities/order-status';

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Executes the use case to update an order's status.
   * @param orderId The ID of the order to update.
   * @param status The new status to set for the order.
   * @returns An Observable indicating success or failure.
   */
  execute(orderId: string, status: OrderStatus): Observable<void> {
    return this.orderRepository.updateOrderStatus(orderId, status);
  }
}
