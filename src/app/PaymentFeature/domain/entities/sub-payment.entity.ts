import { PaymentMethod } from "./payment-method.enum";
import { SubPaymentItem } from "./sub-payment-item.interface";

export class SubPayment {
  constructor(
    public method: PaymentMethod,
    public amount: number,
    public createdAt: Date = new Date(),
    public subPaymentItems: { productId: string; quantity: number }[] = []
  ) { }

  toPlainObject() {
    return {
      method: this.method,
      amount: this.amount,
      createdAt: this.createdAt.toISOString(),
      subPaymentItems: this.subPaymentItems
    };
  }

  static fromPlainObject(obj: any): SubPayment {
    return new SubPayment(
      obj.method,
      obj.amount,
      new Date(obj.createdAt),
      obj.subPaymentItems || []
    );
  }
}
