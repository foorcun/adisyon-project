import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../CartFeature/domain/entity/cart';
import { CartFirebase2Repository } from '../CartFeature/infrastructure/repositories/cart-firebase2.repository';
import { CartItem } from '../CartFeature/domain/entity/cart-item';
import { UserService } from './user.service';
import { UserWithRole } from '../UserFeature/domain/entities/user-with-role';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(new Cart('', {}));
  cart$ = this.cartSubject.asObservable();

  currentUserWithRole: UserWithRole | null = null;

  constructor(private cartRepository: CartFirebase2Repository,
    private userService: UserService
  ) {
    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
      this.listenForCartChanges(); // 🔥 Listen immediately when the service is initialized
    });
  }

  /** ✅ Listen for real-time cart changes */
  private listenForCartChanges(): void {
    this.cartRepository.listenForCartChanges(this.currentUserWithRole!.firebaseUser.uid);
    this.cartRepository.getCartFieldVariable().subscribe(cart => {
      if (cart) {
        this.cartSubject.next(cart);
      }
    });
  }

  /** ✅ Get the current cart */
  getCart(): Cart {
    return this.cartSubject.getValue();
  }

  /** ✅ Add an item to the cart */
  addCartItem(userKey: string, cartItem: CartItem): void {
    this.cartRepository.addCartItem(userKey, cartItem);
  }

  /** ✅ Remove an item from the cart */
  removeItem(userKey: string, productId: string): Observable<void> {
    return this.cartRepository.removeItem(userKey, productId);
  }

  /** ✅ Update the quantity of an item */
  updateItemQuantity(userKey: string, productId: string, newQuantity: number): Observable<void> {
    return this.cartRepository.updateItemQuantity(userKey, productId, newQuantity);
  }

  /** ✅ Clear the cart */
  clearCart(userKey: string): Observable<void> {
    return this.cartRepository.clearCart(userKey);
  }
}
