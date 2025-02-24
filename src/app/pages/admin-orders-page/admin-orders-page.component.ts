import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { TableService } from '../../services/table.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table } from '../../OrderFeature/domain/entities/table.entity';

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
    this.tables = Object.values(this.tableService.getTables()); // Convert object to array
    this.tableMap = this.tableService.getTables(); // Keep table map for quick lookup
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

}
