import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../domain/entities/order.entity';
import { OrderRepository } from '../domain/repositories/order-repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Executes the use case to fetch all orders.
   * @returns An Observable emitting a list of all orders.
   */
  execute(): Observable<Order[]> {
    return this.orderRepository.getAllOrders();
  }
}
