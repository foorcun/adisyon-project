import { PaymentMethod } from "./payment-method.enum";
import { SubPaymentItem } from "./sub-payment-item.interface";

export class SubPayment {
  constructor(
    public method: PaymentMethod,
    public amount: number,
    public createdAt: Date = new Date(),
    public subPaymentItems: SubPaymentItem[] = [] // ✅ renamed from "items"
  ) {}

  toPlainObject() {
    return {
      method: this.method,
      amount: this.amount,
      createdAt: this.createdAt.toISOString(),
      subPaymentItems: this.subPaymentItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
  }

  static fromPlainObject(obj: any): SubPayment {
    return new SubPayment(
      obj.method,
      obj.amount,
      new Date(obj.createdAt),
      Array.isArray(obj.subPaymentItems)
        ? obj.subPaymentItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        : []
    );
  }
}
