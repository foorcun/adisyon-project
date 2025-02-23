import { CartItem } from "../../../domain/entity/cart-item";

export class CartItemAddCommand {
  constructor(
    public userKey: string,
    public cartItem: CartItem
  ) {}
}
