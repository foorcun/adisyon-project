import { Observable } from 'rxjs';
import { PaymentCommand } from '../entities/payment-command';
import { Payment } from '../entities/payment.entity';

export abstract class PaymentRepository {
  /**
   * Creates or initializes a payment for a table.
   * @param tableId The ID of the table.
   * @param totalAmount The total amount for the order.
   * @returns An Observable of the created Payment ID or confirmation.
   */
  abstract initializePayment(tableId: string, totalAmount: number): Observable<void>;

  /**
   * Adds a sub-payment to an existing payment.
   * @param command Contains table ID, method, and amount.
   * @returns An Observable confirming the update.
   */
  abstract addSubPayment(command: PaymentCommand): Observable<void>;

  /**
   * Gets the current payment state for a table.
   * @param tableId The ID of the table.
   * @returns An Observable of the Payment object.
   */
  abstract getPaymentByTableId(tableId: string): Observable<Payment>;

  /**
   * Closes the payment when fully paid.
   * @param tableId The ID of the table to close payment for.
   * @returns An Observable indicating the close completion.
   */
  abstract closePayment(tableId: string): Observable<void>;
}
