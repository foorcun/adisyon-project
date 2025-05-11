import { PaymentMethod } from "./payment-method.enum";

export class SubPayment {
  constructor(
    public method: PaymentMethod,
    public amount: number,
    public createdAt: Date = new Date()
  ) {}

  toPlainObject() {
    return {
      method: this.method,
      amount: this.amount,
      createdAt: this.createdAt.toISOString()
    };
  }

  static fromPlainObject(obj: any): SubPayment {
    return new SubPayment(obj.method, obj.amount, new Date(obj.createdAt));
  }
}
