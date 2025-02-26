import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { OrderService } from '../../services/order.service';
import { MenuService } from '../../services/menu.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryAreaComponent } from './category-area/category-area.component';
import { TableDetailsPageFacadeService } from '../../services/table-details-page.facade.service';

@Component({
  selector: 'app-table-details-page',
  templateUrl: './table-details-page.component.html',
  styleUrls: ['./table-details-page.component.scss'],
  standalone: true,
  imports: [CommonModule, CategoryAreaComponent]
})
export class TableDetailsPageComponent implements OnInit {
  table: Table | null = null;
  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  // Convert categories object into an array of Category objects
  categories$: Observable<Category[]> = new Observable<Category[]>();

  constructor(
    private route: ActivatedRoute,
    private tableService: TableService,
    private orderService: OrderService,
    private menuService: MenuService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService
  ) { 
    this.tableDetailsPageFacadeService.heartBeat();
  }

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('id');
    if (tableId) {
      this.fetchTableDetails(tableId);
    }
    if (this.table === null) {
      this.goBack();
    }

    // Transform categories object into an array
    this.categories$ = this.menuService.categories$.pipe(
      map(categoriesObj =>
        Object.entries(categoriesObj || {}).map(([id, category]) => ({
          id: id,
          name: category.name as string, // Ensure correct type
          menuItems: category.menuItems || {},
          imageUrl: category.imageUrl || ''
        }))
      )
    );
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
