import { PaymentOrder } from "./payment-order.entity";
import { Payment } from "./payment.entity";
import { SubPayment } from "./sub-payment.entity";

export class PaymentFactory {
  /**
   * Creates a new Payment instance.
   * @param tableId The table's unique ID.
   * @param totalAmount Total amount due.
   * @param subPayments Optional record of SubPayments.
   * @param isClosed Optional flag to indicate if payment is closed.
   * @param createdAt Optional creation timestamp.
   * @param orders Optional list of PaymentOrders.
   * @returns A Payment instance.
   */
  static createPayment(
    tableId: string,
    totalAmount: number,
    subPayments: Record<string, SubPayment> = {},
    isClosed: boolean = false,
    createdAt: Date = new Date(),
    orders: PaymentOrder[] = []
  ): Payment {
    return new Payment(
      tableId,
      totalAmount,
      subPayments,
      isClosed,
      createdAt,
      orders
    );
  }

  /**
   * Clones an existing Payment but replaces the orders.
   * @param existing The original Payment instance.
   * @param newOrders New orders to attach.
   * @returns A cloned Payment with updated orders.
   */
  static cloneWithOrders(existing: Payment, newOrders: PaymentOrder[]): Payment {
    return new Payment(
      existing.tableId,
      existing.totalAmount,
      existing.subPayments,
      existing.isClosed,
      existing.createdAt,
      newOrders
    );
  }
}
