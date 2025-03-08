import { ProductOrder } from "./product-order.entity";

export class OrderItem {
  public urunNotu: string = '';
  constructor(
    public product: ProductOrder, // The product being ordered
    public quantity: number // Quantity of the product
  ) {}

  /**
   * Gets the total price for this item (product price × quantity).
   */
  get getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}
