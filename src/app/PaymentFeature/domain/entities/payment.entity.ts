import { PaymentOrder } from "./payment-order.entity";
import { SubPayment } from "./sub-payment.entity";

export class Payment {
  constructor(
    public tableId: string,
    public totalAmount: number,
    public subPayments: Record<string, SubPayment> = {}, // ✅ fix here
    public isClosed: boolean = false,
    public createdAt: Date = new Date(),

    // orders buraya
    public orders: PaymentOrder[]
  ) {}

  get paidAmount(): number {
    return Object.values(this.subPayments).reduce((sum, sp) => sum + sp.amount, 0);
  }

  get remainingAmount(): number {
    return this.totalAmount - this.paidAmount;
  }

  addSubPayment(id: string, sub: SubPayment): void {
    if (this.isClosed) throw new Error('Payment already closed.');
    this.subPayments[id] = sub;
  }

  close(): void {
    if (this.remainingAmount > 0) throw new Error('Payment not complete.');
    this.isClosed = true;
  }
}
