import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepository } from '../../../domain/repositories/cart.repository';

@Injectable({
  providedIn: 'root',
})
export class RemoveCartItemUseCase {
  constructor(private cartRepository: CartRepository) {}

  /**
   * Removes a specific product from the user's cart.
   * @param userKey The unique identifier for the user.
   * @param productId The ID of the product to remove.
   * @returns An Observable indicating the operation's completion.
   */
  execute(userKey: string, productId: string): Observable<void> {
    if (!userKey) {
      throw new Error('User key is required to remove a cart item.');
    }
    if (!productId) {
      throw new Error('Product ID is required to remove a cart item.');
    }

    return this.cartRepository.removeItem(userKey, productId);
  }
}
