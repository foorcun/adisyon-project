import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { TableService } from '../../services/table.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';

@Component({
  selector: 'app-admin-orders-page',
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminOrdersPageComponent implements OnInit {
  allOrders: Order[] = [];
  tables: Table[] = [];
  tableMap: { [key: string]: Table } = {};
  loading = true;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchTables();
  }

  private fetchOrders(): void {
    this.orderService.orders$.subscribe({
      next: (orders) => {
        this.allOrders = Object.values(orders);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching orders.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  private fetchTables(): void {
    this.tableService.tables$.subscribe({
      next: (tables) => {
        // Convert object to sorted array
        const sortedEntries = Object.entries(tables).sort(([, a], [, b]) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );

        // Convert back to an object
        this.tableMap = Object.fromEntries(sortedEntries);

        // Convert values to array for display
        this.tables = Object.values(this.tableMap);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching tables.';
        console.error(error);
      }
    });
  }



  /** ✅ Get table name from table ID */
  getTableName(tableId: string): string {
    return this.tableMap[tableId]?.name || 'Unknown Table';
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus as any).subscribe(() => {
      console.log(`Order ${orderId} updated to ${newStatus}`);
    });
  }

  deleteOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      console.log(`Order ${orderId} deleted`);
      this.allOrders = this.allOrders.filter(order => order.id !== orderId);
    });
  }

  goBackToMenuPage(): void {
    this.router.navigate(['/menu-page']);
  }
  navigateToTableDetails(tableId: string): void {
    this.router.navigate(['/table-details', tableId]);
  }

  getTableStatusClass(tableId: string): string {
    // Get all orders for this table
    const tableOrders = this.allOrders.filter(order => order.tableName === this.tableMap[tableId]?.name);

    // Check for "PENDING" orders first
    if (tableOrders.some(order => order.status === OrderStatus.PENDING)) {
      return 'status-pending';
    }

    // If no "PENDING", check for "IN_PROGRESS"
    if (tableOrders.some(order => order.status === OrderStatus.IN_PROGRESS)) {
      return 'status-in-progress';
    }

    // Default class if no relevant orders
    return 'status-default';
  }

}
