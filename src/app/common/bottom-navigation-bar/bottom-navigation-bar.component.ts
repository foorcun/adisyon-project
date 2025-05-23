import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../UserFeature/domain/entities/user-role.enum';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-bottom-navigation-bar',
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrls: ['./bottom-navigation-bar.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class BottomNavigationBarComponent {

  activeRoute: string = 'home-page';
  userRole: UserRole | null = null;

  navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', route: 'home-page' },
    { id: 'cart', label: 'Cart', icon: 'fas fa-shopping-cart', route: 'cart-page', badge: 0 },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user', route: 'profile-page' },
    { id: 'orders', label: 'Siparişlerim', icon: 'fas fa-store', route: 'user-orders-page' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {
    this.cartService.cart$.subscribe(cart => {
      this.updateBadge('cart', cart.getItemsCount());
    });

    this.userService.currentUserWithRole$.subscribe((userWithRole: UserWithRole | null) => {
      if (userWithRole) {
        this.userRole = userWithRole.role;
        this.updateNavItemsForRole();
      }
    });
  }

  private updateBadge(id: string, count: number): void {
    const item = this.navItems.find(nav => nav.id === id);
    if (item) {
      item.badge = count;
    }
  }

  private updateNavItemsForRole(): void {
    const ordersItem = this.navItems.find(nav => nav.id === 'orders');
    if (ordersItem) {
      if (this.userRole === UserRole.ADMIN) {
        ordersItem.label = 'Sipariş';
        ordersItem.icon = 'fas fa-store';
        ordersItem.route = 'admin-orders-page';
      } else {
        ordersItem.label = 'Siparişlerim';
        ordersItem.icon = 'fas fa-box';
        ordersItem.route = 'user-orders-page';
      }
    }
  }

  navigate(route: string): void {
    this.activeRoute = route;
    this.router.navigate([route]);
  }
}
