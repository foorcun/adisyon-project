import { Product } from "./product.entity";

export class CartItem {
  constructor(public product: Product, public quantity: number = 5) { } // Product aslinda MenuItem

  get getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}

