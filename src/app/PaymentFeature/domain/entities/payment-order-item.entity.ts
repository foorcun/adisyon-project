import { PaymentProduct } from "./payment-product.entity";

export class PaymentOrderItem {
  public urunNotu: string = '';
  constructor(
    public product: PaymentProduct, // The product being ordered
    public quantity: number, // Quantity of the product
    public paidQuantity: number = 0, // Quantity that has been paid for
    public selectedQuantity: number = 0
  ) { }

  /**
   * Gets the total price for this item (product price × quantity).
   */
  get getTotalPrice(): number {
    return this.product.price * this.quantity;
  }

  increaseSelectedQuantity() {
    this.selectedQuantity++;
  }
  decreaseSelectedQuantity() {
    this.selectedQuantity--;
    if (this.selectedQuantity < 0) {
      this.selectedQuantity = 0;
    }
  }
}
