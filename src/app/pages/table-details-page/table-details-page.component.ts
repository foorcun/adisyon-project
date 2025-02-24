import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';

@Component({
  selector: 'app-table-details-page',
  templateUrl: './table-details-page.component.html',
  styleUrls: ['./table-details-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TableDetailsPageComponent implements OnInit {
  table: Table | null = null;
  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private tableService: TableService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('id');
    if (tableId) {
      this.fetchTableDetails(tableId);
    }
    if (this.table === null) {  
      this.goBack();
    }
  }

  private fetchTableDetails(tableId: string): void {
    this.table = this.tableService.getTables()[tableId] || null;
    if (this.table) {
      this.fetchOrdersForTable(this.table.name);
    }
  }

  private fetchOrdersForTable(tableName: string): void {
    this.orderService.orders$.subscribe({
      next: (orders) => {
        this.orders = Object.values(orders).filter(order => order.tableName === tableName);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching orders.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
