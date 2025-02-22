// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { Order } from '../../domain/entities/order.entity';
// import { OrderRepository } from '../../domain/repositories/order-repository';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderApiRepository implements OrderRepository {
//   private apiUrl = '/api/orders.json';

//   constructor(private http: HttpClient) {}

//   getAllOrders(): Observable<Order[]> {
//     return this.http.get<Order[]>(this.apiUrl).pipe(
//       catchError(this.handleError('getAllOrders'))
//     );
//   }

//   getOrderById(id: string): Observable<Order> {
//     return this.http.get<Order[]>(this.apiUrl).pipe(
//       map((orders: Order[]) => {
//         const order = orders.find(o => o.id === id);
//         if (!order) {
//           throw new Error(`Order with id ${id} not found.`);
//         }
//         return order;
//       }),
//       catchError(this.handleError(`getOrderById id=${id}`))
//     );
//   }

//   createOrder(order: Order): Observable<Order> {
//     return this.http.post<Order>('/api/orders', order).pipe(
//       catchError(this.handleError('createOrder'))
//     );
//   }

//   updateOrder(order: Order): Observable<Order> {
//     return this.http.put<Order>(`/api/orders/${order.id}`, order).pipe(
//       catchError(this.handleError('updateOrder'))
//     );
//   }

//   deleteOrder(id: string): Observable<void> {
//     return this.http.delete<void>(`/api/orders/${id}`).pipe(
//       catchError(this.handleError('deleteOrder'))
//     );
//   }

//   private handleError(operation: string) {
//     return (error: any): Observable<never> => {
//       console.error(`${operation} failed: ${error.message}`);
//       return throwError(() => new Error(`Error in ${operation}: ${error.message}`));
//     };
//   }
// }
