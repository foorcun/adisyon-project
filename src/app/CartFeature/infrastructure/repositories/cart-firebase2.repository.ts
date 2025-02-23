
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { Cart } from '../../domain/entity/cart';
import { CartItem } from '../../domain/entity/cart-item';
import { Product } from '../../domain/entity/product.entity';
import { CartItemAddCommand } from '../../application/usecases/cart/cart-item-add.command'; // Adjust the path as necessary
import { Database, ref, set, get, child, onValue, push, remove, update } from '@angular/fire/database';
import { CartMapper } from '../../domain/entity/cart-mapper';

@Injectable({
    providedIn: 'root',
})
export class CartFirebase2Repository {
    private basePath = 'carts';
    private cartSubject = new BehaviorSubject<Cart>(new Cart('', {}));
    cart$ = this.cartSubject.asObservable();

    constructor(
        private database: Database
    ) {
    }

    getCartFieldVariable() {
        this.cart$.subscribe(cart => console.log("[CartFirebase2Repository] cart$:", cart));
        return this.cart$;
    }
    listenForCartChanges(userKey: string) {
        const helloRef = ref(this.database, `${this.basePath}/${userKey}`);
        onValue(helloRef, (snapshot) => {
            const cartData = snapshot.val();
            const transformedCart = CartMapper.toCart(cartData);
            console.log("[CartFirebase2Repository] listenForHelloFirebaseChanges:", transformedCart);
            this.cartSubject.next(transformedCart);
        });
    }

    addCartItem(userKey: string, value: CartItem) {
        const itemsRef = ref(this.database, `carts/${userKey}/items`);

        push(itemsRef, value)
            .then(() => console.log('Item added successfully!'))
            .catch((error) => console.error('Error adding item:', error));
    }


    clearCart(userKey: string): Observable<void> {
        console.log("[CartFirebase2Repository] clearCart:", userKey);
        const cartItemsRef = ref(this.database, `carts/${userKey}/items`);

        return from(remove(cartItemsRef));
    }

    removeItem(userKey: string, productId: string): Observable<void> {
        const cartItemsRef = ref(this.database, `carts/${userKey}/items/${productId}`);

        return from(remove(cartItemsRef));
    }


    updateItemQuantity(userKey: string, productId: string, newQuantity: number): Observable<void> {
        const itemRef = ref(this.database, `carts/${userKey}/items/${productId}`);
        return from(update(itemRef, { quantity: newQuantity }));
    }

}
