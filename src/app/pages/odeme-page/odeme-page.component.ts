import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Subscription } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../services/table-details-page.facade.service';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';
import { OdemePageArea2Component } from "./odeme-page-area2/odeme-page-area2.component";
import { OdemePageArea3Component } from "./odeme-page-area3/odeme-page-area3.component";
import { OdemePageArea1Component } from "./odeme-page-area1/odeme-page-area1.component";

@Component({
  selector: 'app-odeme-page',
  imports: [CommonModule, OdemePageArea2Component, OdemePageArea3Component, OdemePageArea1Component],
  templateUrl: './odeme-page.component.html',
  styleUrl: './odeme-page.component.scss'
})
export class OdemePageComponent implements OnInit {
  tableId: string | null = null;
  orders: Order[] = [];

  table: Table | null = null;

  private tableSubscription!: Subscription;

  constructor(
    private orderService: OrderService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tableId = this.route.snapshot.paramMap.get('id');
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders.filter(order =>
        order.tableUUID === this.tableId &&
        (order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS)
      );

    });
  }

  ngOnInit(): void {
    // this.orders = Object.values(this.orderService.getOrders()).filter(order => order.tableUUID === this.tableId);


    // ✅ Manual subscriptions
    this.tableSubscription = this.tableDetailsPageFacadeService.table$.subscribe(table => {
      this.table = table;
      if (!table) {
        this.router.navigate(['/admin-orders-page']);
      }
    });

  }
  goBack(): void {
    window.history.back();
  }




  getTotalAmount(): number {
    return this.orders.reduce((sum, order) => sum + order.getTotalAmount(), 0);
  }

  getCombinedStatuses(): string {
    const uniqueStatuses = [...new Set(this.orders.map(order => order.status))];
    return uniqueStatuses.join(', ');
  }

  getOrderIdsString(): string {
    return this.orders.map(o => o.id).join(', ');
  }



}
