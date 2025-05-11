import { SubPayment } from "./sub-payment.entity";

export class Payment {
  constructor(
    public tableId: string,
    public totalAmount: number,
    public subPayments: SubPayment[] = [],
    public isClosed: boolean = false,
    public createdAt: Date = new Date()
  ) {}

  /**
   * Returns the total amount paid so far.
   */
  get paidAmount(): number {
    return this.subPayments.reduce((sum, sp) => sum + sp.amount, 0);
  }

  /**
   * Returns the remaining amount to be paid.
   */
  get remainingAmount(): number {
    return this.totalAmount - this.paidAmount;
  }

  /**
   * Adds a sub-payment to the payment.
   */
  addSubPayment(sub: SubPayment): void {
    if (this.isClosed) {
      throw new Error('Cannot add sub-payment: Payment is already closed.');
    }

    this.subPayments.push(sub);
  }

  /**
   * Finalizes the payment if fully paid.
   */
  close(): void {
    if (this.remainingAmount > 0) {
      throw new Error(`Cannot close payment: ${this.remainingAmount} remaining.`);
    }

    this.isClosed = true;
  }
}
