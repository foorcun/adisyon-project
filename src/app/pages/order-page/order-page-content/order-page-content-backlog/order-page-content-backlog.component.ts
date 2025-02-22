import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../OrderFeature/domain/entities/order.entity';
import { OrderStatus } from '../../../../OrderFeature/domain/entities/order-status';
import { OrderPageFacadeService } from '../../../../services/order-page.facade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-order-page-content-backlog',
  standalone: true, // If using standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './order-page-content-backlog.component.html',
  styleUrls: ['./order-page-content-backlog.component.scss']
})
export class OrderPageContentBacklogComponent implements OnInit {
  orders: Order[] = [];
  statuses = Object.values(OrderStatus);

  constructor(private orderPageFacadeService: OrderPageFacadeService) {}

  ngOnInit(): void {
    this.subscribeToOrders();
  }

  /**
   * Subscribes to the orders and initializes the backlog.
   */
  private subscribeToOrders(): void {
    this.orderPageFacadeService
      .getOrders()
      .pipe(
        tap((orders) => {
          console.log('Orders fetched successfully:', orders);
          this.orders = orders; // Assign all orders to the backlog
        })
      )
      .subscribe({
        error: (error) => console.error('Error fetching orders:', error),
      });
  }

  /**
   * Updates the status of an order and relies on reactive updates from the service.
   */
  onStatusChange(orderId: string, newStatus: OrderStatus): void {
    this.orderPageFacadeService.updateOrderStatus(orderId, newStatus);
  }
}
