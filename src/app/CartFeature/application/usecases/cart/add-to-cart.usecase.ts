import { Injectable } from '@angular/core';
import { Observable, switchMap, of } from 'rxjs';
import { CartRepository } from '../../../domain/repositories/cart.repository';
import { CartItemAddCommand } from './cart-item-add.command'; // Adjust the path as needed
import { CartItem } from '../../../domain/entity/cart-item';

@Injectable({
  providedIn: 'root',
})
export class AddToCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  /**
   * Adds a product to the cart.
   * If the product already exists in the cart, updates its quantity.
   * @param {CartItemAddCommand} command - The command containing userKey and cartItem.
   * @returns {Observable<void>} An observable indicating the operation's completion.
   */
  execute(command: CartItemAddCommand): Observable<void> {
    const { userKey, cartItem } = command;

    return this.cartRepository.getCart(userKey).pipe(
      switchMap((cart) => {
        const existingItem = cart.items[cartItem.product.id]; // Use object lookup instead of .find()

        if (existingItem) {
          // Update quantity if the item already exists
          return this.cartRepository.updateItemQuantity(
            userKey,
            cartItem.product.id,
            existingItem.quantity + cartItem.quantity
          );
        } else {
          // Add a new item to the cart
          return this.cartRepository.addItem(command);
        }
      })
    );
  }
}
