import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders-page',
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminOrdersPageComponent implements OnInit {
  allOrders: Order[] = [];
  loading = true;
  errorMessage = '';

  constructor(private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus as any).subscribe(() => {
      console.log(`Order ${orderId} updated to ${newStatus}`);
    });
  }

  deleteOrder(orderId: string) {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      console.log(`Order ${orderId} deleted`);
      this.allOrders = this.allOrders.filter(order => order.id !== orderId);
    });
  }

  goBackToMenuPage(): void {
    this.router.navigate(['/menu-page']);
  }
}
