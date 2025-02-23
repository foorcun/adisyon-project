import { Observable } from 'rxjs';
import { Order } from '../entities/order.entity';
import { OrderDto } from '../entities/order.dto';

export abstract class OrderRepository {
  /**
   * Creates a new order.
   * @param order The order to create.
   * @returns An Observable indicating the creation completion.
   */
  abstract createOrder(order: OrderDto): Observable<string>;

  /**
   * Fetches an order by its ID.
   * @param orderId The unique identifier of the order.
   * @returns An Observable of the fetched order.
   */
  abstract getOrderById(orderId: string): Observable<Order>;

  /**
   * Fetches all orders.
   * @returns An Observable of the list of all orders.
   */
  abstract getAllOrders(): Observable<Order[]>;

  /**
   * Updates the status of an existing order.
   * @param orderId The unique identifier of the order.
   * @param status The new status to set.
   * @returns An Observable indicating the update completion.
   */
  abstract updateOrderStatus(orderId: string, status: string): Observable<void>;

  /**
   * Deletes an order by its ID.
   * @param orderId The unique identifier of the order.
   * @returns An Observable indicating the deletion completion.
   */
  abstract deleteOrder(orderId: string): Observable<void>;
}
