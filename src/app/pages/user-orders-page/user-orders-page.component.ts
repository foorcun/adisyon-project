import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-orders-page',
  templateUrl: './user-orders-page.component.html',
  styleUrls: ['./user-orders-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class UserOrdersPageComponent implements OnInit {
  userOrders: Order[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.currentUserWithRole$.subscribe({
      next: (user: UserWithRole | null) => {
        if (!user) {
          this.errorMessage = 'User not logged in.';
          this.loading = false;
          return;
        }

        this.orderService.getUserOrders(user.firebaseUser.uid).subscribe({
          next: (orders) => {
            this.userOrders = orders;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error fetching orders.';
            console.error(error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Authentication error.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  goBackToMenuPage(): void {
    this.router.navigate(['/menu-page']);
  }
}
