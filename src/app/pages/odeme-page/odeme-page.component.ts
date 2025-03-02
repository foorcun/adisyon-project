import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Subscription } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../services/table-details-page.facade.service';

@Component({
  selector: 'app-odeme-page',
  imports: [CommonModule],
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
  ) {
    this.tableId = this.route.snapshot.paramMap.get('id');
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders.filter(order => order.tableUUID === this.tableId);
    });
  }

  ngOnInit(): void {
    // this.orders = Object.values(this.orderService.getOrders()).filter(order => order.tableUUID === this.tableId);


    // ✅ Manual subscriptions
    this.tableSubscription = this.tableDetailsPageFacadeService.table$.subscribe(table => {
      this.table = table;
    });

  }
  goBack(): void {
    window.history.back();
  }
}
