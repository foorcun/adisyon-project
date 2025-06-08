import { Injectable } from '@angular/core';
import { Database, ref, push, set, update, remove, onValue, DataSnapshot } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderRepository } from '../../domain/repositories/order-repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status';
import { OrderDto } from '../../domain/entities/order.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderFirebaseRepository extends OrderRepository {
  private basePath = 'orders';
 // menuKey = 'menuKey_zeuspub';
    menuKey = environment.key;

  // private cartSubject = new BehaviorSubject<Cart>(new Cart('', {}));
  // cart$ = this.cartSubject.asObservable();

  private ordersSubject = new BehaviorSubject<Order[]>([]); // Now it holds an array of orders
  orders$ = this.ordersSubject.asObservable();


  constructor(private database: Database) {
    super();
  }

  /**
   * Creates a new order with Firebase-generated ID.
   * @param order The order to create.
   * @returns An Observable emitting the generated order ID.
   */

  /** 
    * Listens for changes to all orders in Firebase and updates the BehaviorSubject.
    */
  listenForAllOrdersChanges(): void {
    const ordersRef = ref(this.database, `${this.basePath}/${this.menuKey}`);

    onValue(ordersRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const orders = Object.keys(data).map((key) => {
          const order = data[key];
          return new Order(
            key, // Use Firebase key as the order ID
            order.items,
            order.tableUUID,
            order.status,
            new Date(order.createdAt),
            new Date(order.updatedAt),
            order.totalAmount,
            order.userUid
          );
        });

        console.log("[OrderFirebaseRepository] listenForAllOrdersChanges:", orders);
        this.ordersSubject.next(orders);
      } else {
        console.warn("[OrderFirebaseRepository] - No orders found.");
        this.ordersSubject.next([]);
      }
    }, (error) => {
      console.error(`[OrderFirebaseRepository] - Error listening for all orders: ${error.message}`);
    });
  }



  createOrder(order: OrderDto): Observable<string> {
    console.log("[OrderFirebaseRepository] - Creating order...", order);
    return new Observable((observer) => {
      const orderRef = push(ref(this.database, `${this.basePath}/${this.menuKey}`));

      set(orderRef, order)
        .then(() => {
          observer.next(orderRef.key as string); // Firebase-generated ID
          observer.complete();
          console.log("[OrderFirebaseRepository] - Order created successfully.");
        })
        .catch((error) => observer.error(error));
    });
  }


  /**
   * Fetches a specific order by its ID.
   * @param orderId The ID of the order.
   * @returns An Observable emitting the fetched Order.
   */
  getOrderById(orderId: string): Observable<Order> {
    return new Observable((observer) => {
      const orderRef = ref(this.database, `${this.basePath}/${this.menuKey}/${orderId}`);
      onValue(
        orderRef,
        (snapshot: DataSnapshot) => {
          const data = snapshot.val();
          if (data) {
            observer.next(
              new Order(
                orderId,
                data.items,
                data.tableName,
                data.status,
                new Date(data.createdAt),
                new Date(data.updatedAt),
                data.totalAmount,
                data.userUid
              )
            );
          } else {
            observer.error(new Error(`Order with ID ${orderId} not found.`));
          }
        },
        (error) => observer.error(error)
      );
    });
  }

  /**
   * Fetches all orders from Firebase.
   * @returns An Observable emitting a list of all orders.
   */
  getAllOrders(): Observable<Order[]> {
    return new Observable((observer) => {
      const ordersRef = ref(this.database, `${this.basePath}/${this.menuKey}`);
      onValue(
        ordersRef,
        (snapshot: DataSnapshot) => {
          const data = snapshot.val();
          if (data) {
            const orders = Object.keys(data).map((key) => {
              const order = data[key];
              return new Order(
                key, // Use Firebase key as the order ID
                order.items,
                order.tableUUID,
                order.status,
                new Date(order.createdAt),
                new Date(order.updatedAt),
                order.totalAmount,
                order.userUid
              );
            });
            observer.next(orders);
          } else {
            observer.next([]);
          }
        },
        (error) => observer.error(error)
      );
    });
  }

  /**
   * Updates the status of an order.
   * @param orderId The ID of the order to update.
   * @param status The new status of the order.
   * @returns An Observable indicating success or failure.
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return new Observable((observer) => {
      const orderRef = ref(this.database, `${this.basePath}/${this.menuKey}/${orderId}`);
      update(orderRef, { status })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  /**
   * Deletes an order by its ID.
   * @param orderId The ID of the order to delete.
   * @returns An Observable indicating success or failure.
   */
  deleteOrder(orderId: string): Observable<void> {
    console.log("[OrderFirebaseRepository] - Deleting order with ID:", orderId);
    return new Observable((observer) => {
      const orderRef = ref(this.database, `${this.basePath}/${this.menuKey}/${orderId}`);
      remove(orderRef)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }
}
