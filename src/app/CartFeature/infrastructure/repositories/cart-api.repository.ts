// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';
// import { CartRepository } from '../../domain/repositories/cart.repository';
// import { Cart } from '../../domain/entity/cart';
// import { CartItem } from '../../domain/entity/cart-item';
// import { Product } from '../../domain/entity/product.entity';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartApiRepository extends CartRepository {
//   private apiUrl = '/api/cart.json'; // Base URL for the cart API

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

//   updateItemQuantity(productId: string, quantity: number): Observable<void> {
//     return this.http.put<void>(`${this.apiUrl}/items/${productId}`, { quantity });
//   }

//   removeItem(productId: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/items/${productId}`);
//   }

//   clearCart(): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/clear`);
//   }
// }
