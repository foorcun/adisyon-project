// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable, switchMap } from 'rxjs';
// import { CartRepository } from '../../domain/repositories/cart.repository';
// import { Cart } from '../../domain/entity/cart';
// import { CartItem } from '../../domain/entity/cart-item';
// import { Product } from '../../domain/entity/product.entity';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartNodeServerRepository extends CartRepository {
//   private apiUrl = 'http://localhost:3000/cart'; // Base URL for the cart API

//   constructor(private http: HttpClient) {
//     super();
//   }

//   getCart(): Observable<Cart> {
//     return this.http.get<Cart>(`${this.apiUrl}`).pipe(
//       map((data: any) => {
//         // Transform plain object into Cart instance
//         const items = data.items.map(
//           (item: any) =>
//             new CartItem(
//               new Product(
//                 item.product.id,
//                 item.product.name,
//                 item.product.description,
//                 item.product.price,
//                 item.product.imageUrl,
//                 item.product.categoryId
//               ),
//               item.quantity
//             )
//         );
//         return new Cart(data.id, items);
//       })
//     );
//   }

//   addItem(item: CartItem): Observable<void> {
//     return this.http.post<void>(`${this.apiUrl}/items`, item);
//   }

// updateItemQuantity(productId: string, newQuantity: number): Observable<void> {
//   return this.http.get<{ id: string; items: any[] }>(`${this.apiUrl}`).pipe(
//     map((cart) => {
//       const updatedItems = cart.items.map(item =>
//         item.product.id === productId ? { ...item, quantity: newQuantity } : item
//       );
//       return { ...cart, items: updatedItems };
//     }),
//     switchMap(updatedCart => this.http.put<void>(`${this.apiUrl}`, updatedCart))
//   );
// }



//   removeItem(productId: string): Observable<void> {
//     return this.http.get<{ id: string; items: any[] }>(this.apiUrl).pipe(
//       map((cart) => {
//         const updatedItems = cart.items.filter(item => item.product.id !== productId);
//         return { ...cart, items: updatedItems };
//       }),
//       switchMap(updatedCart => this.http.put<void>(this.apiUrl, updatedCart))
//     );
//   }


//   clearCart(): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/clear`);
//   }
// }
