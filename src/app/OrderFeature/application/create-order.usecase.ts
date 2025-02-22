import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrderCommand } from './create-order.command';
import { OrderRepository } from '../domain/repositories/order-repository';

@Injectable({
  providedIn: 'root',
})
export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Executes the use case to create a new order.
   * @param command The command object containing the user key and order details.
   * @returns An Observable emitting the generated order ID.
   */
  execute(command: CreateOrderCommand): Observable<string> {
    return this.orderRepository.createOrder(command.order);
  }
}
