import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Table } from '../../domain/entities/table.entity';
import { Order } from '../../domain/entities/order.entity';

@Injectable({
  providedIn: 'root',
})
export class TableFirebaseRepository {
  private basePath = 'myTables';
  private tablesSubject = new BehaviorSubject<{ [key: string]: Table } | null>(null);
  tables$ = this.tablesSubject.asObservable();

  constructor(private database: Database) {}

  listenForTablesChanges() {
    const tablesRef = ref(this.database, this.basePath);
    onValue(tablesRef, (snapshot) => {
      const tablesData = snapshot.val();
      
      // 🔥 Convert Firebase data to Table instances
      if (tablesData) {
        const transformedTables: { [key: string]: Table } = {};

        Object.entries(tablesData).forEach(([tableId, tableData]: [string, any]) => {
          transformedTables[tableId] = new Table(
            tableId,
            tableData.name,
            tableData.capacity,
            tableData.status,
            this.transformOrders(tableData.orders) // 🔥 Convert orders properly
          );
        });

        this.tablesSubject.next(transformedTables);
      }
    });
  }

  // 🔥 Convert Firebase orders object to Order instances
  private transformOrders(ordersData: any): { [key: string]: Order } {
    if (!ordersData) return {};

    const orders: { [key: string]: Order } = {};
    Object.entries(ordersData).forEach(([orderId, orderData]: [string, any]) => {
      orders[orderId] = new Order(
        orderId,
        Object.values(orderData.items || {}), // Convert object to array
        orderData.tableName || '',
        orderData.status,
        new Date(orderData.createdAt || Date.now()),
        new Date(orderData.updatedAt || Date.now()),
        orderData.totalAmount || 0,
        orderData.userUid || ''
      );
    });

    return orders;
  }
}
