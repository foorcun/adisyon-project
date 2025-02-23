import { Observable } from 'rxjs';
import { Cart } from '../entity/cart';
import { CartItem } from '../entity/cart-item';
import { CartItemAddCommand } from '../../application/usecases/cart/cart-item-add.command';

export abstract class CartRepository {
  abstract getCart(userKey: string): Observable<Cart>;
  abstract addItem(command: CartItemAddCommand): Observable<void>;
  abstract updateItemQuantity(userKey: string, productId: string, newQuantity: number): Observable<void>;
  abstract removeItem(userKey: string, productId: string): Observable<void>;
  abstract clearCart(userKey: string): Observable<void>;
}
