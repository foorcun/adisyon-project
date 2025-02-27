import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-odeme-page',
  imports: [CommonModule],
  templateUrl: './odeme-page.component.html',
  styleUrl: './odeme-page.component.scss'
})
export class OdemePageComponent implements OnInit {
  tableId: string | null = null;
  orders: Order[] = [];
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
  ) {
    this.tableId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.orders = Object.values(this.orderService.getOrders()).filter(order => order.tableUUID === this.tableId);

  }
  goBack(): void {
    window.history.back();
  }
}
