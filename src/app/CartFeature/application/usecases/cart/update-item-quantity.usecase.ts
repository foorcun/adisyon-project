import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepository } from '../../../domain/repositories/cart.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateItemQuantityUseCase {
  constructor(private cartRepository: CartRepository) {}

  /**
   * Updates the quantity of a specific product in the user's cart.
   * @param userKey The unique identifier for the user.
   * @param productId The ID of the product to update.
   * @param quantity The new quantity of the product.
   * @returns An Observable indicating the operation's completion.
   */
  execute(userKey: string, productId: string, quantity: number): Observable<void> {
    if (!userKey) {
      throw new Error('User key is required to update item quantity.');
    }
    if (!productId) {
      throw new Error('Product ID is required to update item quantity.');
    }
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1.');
    }

    return this.cartRepository.updateItemQuantity(userKey, productId, quantity);
  }
}
