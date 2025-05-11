import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { TableService } from '../../services/table.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';
import { AdminOrdersPageFacadeService } from '../../services/admin-orders-page-facade.service';

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
    private router: Router,
    private adminOrdersPageFacadeService: AdminOrdersPageFacadeService
  ) { }

  ngOnInit(): void {
    // this.fetchOrders();
    this.orderService.orders$.subscribe((orders) => {
      // this.allOrders = Object.values(orders);
      this.allOrders = orders;
      // console.log("[AdminOrdersPageComponent] Orders: ", this.allOrders);
      this.loading = false;
    });
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
  navigateToTableDetails(table: Table): void {
    this.adminOrdersPageFacadeService.setSelectedTable(table);
    // this.router.navigate(['/table-details', table.id]);
    this.router.navigate(['/table-details', this.adminOrdersPageFacadeService.selectedTable!.id]);
  }

  getTableStatusClass(tableId: string): string {
    // console.log("[AdminOrdersPageComponent] getTableStatusClass: ", tableId);

    // console.log("[AdminOrdersPageComponent] All Orders: ", this.allOrders);

    if (!tableId) {
      // console.warn("[AdminOrdersPageComponent] Warning: Invalid table ID.");
      return 'status-default';
    }

    if (!Array.isArray(this.allOrders)) {
      // console.warn("[AdminOrdersPageComponent] Warning: allOrders is not an array.");
      return 'status-default';
    }

    // ✅ Filter orders directly using `tableUUID`
    const tableOrders = this.allOrders.filter(order => {
      // console.log("[AdminOrdersPageComponent-filter] Order: ", order);
      // console.log("[AdminOrdersPageComponent-filter] Order Table UUID: ", order.tableUUID);
      // console.log("[AdminOrdersPageComponent-filter] Table ID: ", tableId);
      return order.tableUUID === tableId;
    });
    // console.log("[AdminOrdersPageComponent] Table Orders: ", tableOrders);

    // ✅ Check for "PENDING" orders first
    if (tableOrders.some(order => order.status === OrderStatus.PENDING)) {
      return 'status-pending';
    }

    // ✅ If no "PENDING", check for "IN_PROGRESS"
    if (tableOrders.some(order => order.status === OrderStatus.IN_PROGRESS)) {
      return 'status-in-progress';
    }

    // ✅ Default class if no relevant orders
    return 'status-default';
  }


}
