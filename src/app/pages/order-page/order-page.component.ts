import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';
import { OrderPageNavbarComponent } from './order-page-navbar/order-page-navbar.component';
import { OrderPageContentComponent } from './order-page-content/order-page-content.component';
import { OrderPageFacadeService } from '../../services/order-page.facade.service';

@Component({
  selector: 'app-order-page',
  standalone: true, // If using standalone components
  imports: [CommonModule, FormsModule, OrderPageNavbarComponent, OrderPageContentComponent],
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  orders: Order[] = [];
  statuses = Object.values(OrderStatus); // All statuses from the enum

  constructor(private orderPageFacadeService: OrderPageFacadeService) {}

  ngOnInit(): void {
    this.subscribeToOrders();
  }

  /**
   * Subscribes to the orders observable for reactive updates.
   */
  private subscribeToOrders(): void {
    this.orderPageFacadeService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders fetched successfully:', orders);
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      },
    });
  }

  /**
   * Updates the status of an order using the facade service.
   */
  onStatusChange(orderId: string, newStatus: OrderStatus): void {
    this.orderPageFacadeService.updateOrderStatus(orderId, newStatus);
  }
}
