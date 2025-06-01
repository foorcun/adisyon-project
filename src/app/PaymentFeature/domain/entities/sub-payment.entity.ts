export class SubPayment {
  constructor(
    public method: string,
    public amount: number,
    public createdAt: Date = new Date(),
    public subPaymentItems: { productId: string; quantity: number }[] = []
  ) {}

  toPlainObject(): any {
    return {
      method: this.method,
      amount: this.amount,
      createdAt: this.createdAt.toISOString(),
      subPaymentItems: this.subPaymentItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  }

  static fromPlainObject(obj: any): SubPayment {
    return new SubPayment(
      obj.method,
      obj.amount,
      obj.createdAt ? new Date(obj.createdAt) : new Date(),
      Array.isArray(obj.subPaymentItems) ? obj.subPaymentItems : []
    );
  }
}
