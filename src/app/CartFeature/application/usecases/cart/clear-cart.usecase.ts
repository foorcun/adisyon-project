import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepository } from '../../../domain/repositories/cart.repository';

@Injectable({
  providedIn: 'root',
})
export class ClearCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  /**
   * Clears the entire cart for a specific user.
   * @param userKey The unique identifier for the user.
   * @returns An Observable indicating the operation's completion.
   */
  execute(userKey: string): Observable<void> {
    if (!userKey) {
      throw new Error('User key is required to clear the cart.');
    }

    return this.cartRepository.clearCart(userKey);
  }
}
