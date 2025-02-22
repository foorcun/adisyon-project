import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../OrderFeature/domain/entities/order.entity';
import { OrderStatus } from '../../../../OrderFeature/domain/entities/order-status';
import { OrderPageFacadeService } from '../../../../services/order-page.facade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-page-content-to-do',
  standalone: true, // If using standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './order-page-content-to-do.component.html',
  styleUrls: ['./order-page-content-to-do.component.scss']
})
export class OrderPageContentToDoComponent implements OnInit {
  orders: Order[] = [];
  statuses = Object.values(OrderStatus);

  constructor(private orderPageFacadeService: OrderPageFacadeService) {}

  ngOnInit(): void {
    this.subscribeToOrders();
  }

  /**
   * Subscribes to the orders stream and filters for pending orders.
   */
  private subscribeToOrders(): void {
    this.orderPageFacadeService
      .getOrders()
      .pipe(
        tap((orders) => console.log('Fetched orders:', orders)),
        filter((orders) => orders.length > 0), // Ensure orders exist before processing
        tap((orders) => {
          this.orders = orders.filter((order) => order.status === OrderStatus.PENDING);
        })
      )
      .subscribe({
        error: (error) => console.error('Error subscribing to orders:', error),
      });
  }

  /**
   * Updates the status of an order and relies on reactive updates from the service.
   */
  onStatusChange(orderId: string, newStatus: OrderStatus): void {
    this.orderPageFacadeService.updateOrderStatus(orderId, newStatus);
  }
}
