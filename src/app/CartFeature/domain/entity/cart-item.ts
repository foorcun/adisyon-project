import { Product } from "./product.entity";

export class CartItem {
  constructor(public product: Product, public quantity: number = 1) { }

  get getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}

