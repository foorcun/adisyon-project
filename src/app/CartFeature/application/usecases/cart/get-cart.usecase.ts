import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../../domain/entity/cart';
import { CartRepository } from '../../../domain/repositories/cart.repository';

@Injectable({
  providedIn: 'root',
})
export class GetCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  /**
   * Executes the use case to fetch the cart for a specific user.
   * @param userKey The unique identifier for the user (e.g., email, UUID).
   * @returns An Observable of the Cart object.
   */
  execute(userKey: string): Observable<Cart> {
    if (!userKey) {
      throw new Error('User key is required to fetch the cart.');
    }
    return this.cartRepository.getCart(userKey);
  }
}
