// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { map, switchMap, catchError, tap } from 'rxjs/operators';
// import { CartRepository } from '../../domain/repositories/cart.repository';
// import { Cart } from '../../domain/entity/cart';
// import { CartItem } from '../../domain/entity/cart-item';
// import { Product } from '../../domain/entity/product.entity';
// import { CartItemAddCommand } from '../../application/usecases/cart/cart-item-add.command'; // Adjust the path as necessary
// import { Database } from '@angular/fire/database';
// import { DataSnapshot, onValue, ref } from 'firebase/database';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartFirebaseRepository extends CartRepository {
//   private baseUrl = 'https://rodb-56626-default-rtdb.europe-west1.firebasedatabase.app/carts/';
//   private basePath = 'carts';

//   constructor(
//     private http: HttpClient,
//     private database: Database
//   ) {
//     super();
//   }

//   private getUserCartUrl(userKey: string): string {
//     if (!userKey) {
//       throw new Error('User key is not provided. Provide a valid user key.');
//     }
//     return `${this.baseUrl}${userKey}.json`;
//   }
//   private getUserCartRef(userKey: string) {
//     return ref(this.database, `${this.basePath}/${userKey}`);
//   }

//   // getCart(userKey: string): Observable<Cart> {
//   //   return this.http.get<any>(this.getUserCartUrl(userKey)).pipe(
//   //     map((data) => {
//   //       if (!data || !data.items) {
//   //         return new Cart('', []);
//   //       }
//   //       const items = data.items.map(
//   //         (item: any) =>
//   //           new CartItem(
//   //             new Product(
//   //               item.product.id,
//   //               item.product.name,
//   //               item.product.description,
//   //               item.product.price,
//   //               item.product.imageUrl,
//   //               item.product.categoryId
//   //             ),
//   //             item.quantity
//   //           )
//   //       );
//   //       return new Cart('', items);
//   //     }),
//   //     catchError((error) => {
//   //       console.error('Error fetching cart:', error);
//   //       return throwError(() => new Error('Failed to fetch cart.'));
//   //     })
//   //   );
//   // }

// getCart(userKey: string): Observable<Cart> {
//     return new Observable((observer) => {
//       const cartRef = this.getUserCartRef(userKey);
//       onValue(
//         cartRef,
//         (snapshot: DataSnapshot) => {
//           const data = snapshot.val();
//           if (data && data.items) {
//             const items = data.items.map(
//               (item: any) =>
//                 new CartItem(
//                   new Product(
//                     item.product.id,
//                     item.product.name,
//                     item.product.description,
//                     item.product.price,
//                     item.product.imageUrl,
//                     item.product.categoryId
//                   ),
//                   item.quantity
//                 )
//             );
//             observer.next(new Cart(userKey, items));
//           } else {
//             observer.next(new Cart(userKey, [])); // Return empty cart if not found
//           }
//         },
//         (error) => observer.error(error)
//       );
//     });
//   }


//   addItem(command: CartItemAddCommand): Observable<void> {
//     const { userKey, cartItem } = command;

//     return this.getCart(userKey).pipe(
//       map((cart) => {
//         cart.addItem(cartItem);
//         return cart;
//       }),
//       switchMap((updatedCart) =>
//         this.http.put<void>(this.getUserCartUrl(userKey), { items: updatedCart.items })
//       ),
//       catchError((error) => {
//         console.error('Error adding item to cart:', error);
//         return throwError(() => new Error('Failed to add item.'));
//       })
//     );
//   }

//   updateItemQuantity(userKey: string, productId: string, newQuantity: number): Observable<void> {
//     return this.getCart(userKey).pipe(
//       map((cart) => {
//         cart.updateItemQuantity(productId, newQuantity);
//         return cart;
//       }),
//       switchMap((updatedCart) =>
//         this.http.put<void>(this.getUserCartUrl(userKey), { items: updatedCart.items })
//       ),
//       catchError((error) => {
//         console.error('Error updating item quantity:', error);
//         return throwError(() => new Error('Failed to update item quantity.'));
//       })
//     );
//   }

//   removeItem(userKey: string, productId: string): Observable<void> {
//     return this.getCart(userKey).pipe(
//       map((cart) => {
//         cart.removeItem(productId);
//         return cart;
//       }),
//       switchMap((updatedCart) =>
//         this.http.put<void>(this.getUserCartUrl(userKey), { items: updatedCart.items })
//       ),
//       catchError((error) => {
//         console.error('Error removing item from cart:', error);
//         return throwError(() => new Error('Failed to remove item.'));
//       })
//     );
//   }

//   clearCart(userKey: string): Observable<void> {
//     return this.http.delete<void>(this.getUserCartUrl(userKey)).pipe(
//       tap(() => console.log('Cart cleared successfully.')),
//       catchError((error) => {
//         console.error('Error clearing cart:', error);
//         return throwError(() => new Error('Failed to clear cart.'));
//       })
//     );
//   }
// }
