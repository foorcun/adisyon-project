import { PaymentProduct } from "./payment-product.entity";

export class PaymentOrderItem {
  public urunNotu: string = '';
  constructor(
    public product: PaymentProduct, // The product being ordered
    public quantity: number // Quantity of the product
  ) {}

  /**
   * Gets the total price for this item (product price × quantity).
   */
  get getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}
