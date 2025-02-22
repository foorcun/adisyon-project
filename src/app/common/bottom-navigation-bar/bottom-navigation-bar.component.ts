import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { CartModalService } from '../../../services/cart-modal.service';
// import { ProfileModalService } from '../../../services/profile-modal.service';
// import { OrderModalService } from '../../../services/order-modal.service';
// import { CartPageFacadeService } from '../../../services/cart-page.facade.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../UserFeature/domain/entities/user-role.enum';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';
// import { Cart } from '../../../CartFeature/domain/entity/cart';
// import { UserRole } from '../../../UserFeature/domain/entities/user-role.enum';
// import { UserService } from '../../../services/user.service';
// import { UserWithRole } from '../../../UserFeature/domain/entities/user-with-role';
// import { MyOrdersModalService } from '../../../services/modals/my-orders-modal.service';

@Component({
  selector: 'app-bottom-navigation-bar',
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrls: ['./bottom-navigation-bar.component.scss'],
  imports: [CommonModule]
})
export class BottomNavigationBarComponent {


  private itemCountSubject = new BehaviorSubject<number>(0); // Holds the cart state
  itemCount$ = this.itemCountSubject.asObservable(); // Observable for components to subscribe to
  userRole: UserRole | null = null;

  navItems = [
    { label: 'Home', icon: 'fas fa-home', route: 'home-page' },
    // { label: 'Search', icon: 'fas fa-search', route: '/search' },
    { label: 'Cart', icon: 'fas fa-shopping-cart', route: 'cart-page', badge: 3 },
    { label: 'Profile', icon: 'fas fa-user', route: 'profile-page' },
    // { label: 'Order', icon: 'fas fa-store', route: 'order-page' }
    { label: 'My Orders', icon: 'fas fa-store', route: 'user-orders-page' }
  ];

  constructor(
    private router: Router,
    // private cartModalService: CartModalService,
    // private profileModalService: ProfileModalService,
    // private orderModalService: OrderModalService,
    // private myOrdersModalService: MyOrdersModalService,
    // private cartPageFacadeService: CartPageFacadeService,
    private userService: UserService
  ) {
    // this.cartPageFacadeService.getCart().subscribe((cart: Cart) => {
    //   console.log('Cart updated in bottom nav:', cart);
    //   this.itemCountSubject.next(cart.getItemsCount());
    // });

    this.itemCount$.subscribe((count) => {
      console.log('Item count updated:', count);
      this.navItems[1].badge = count;
    });

    // Subscribe to user role changes
    this.userService.currentUserWithRole$.subscribe((userWithRole: UserWithRole | null) => {
      if (userWithRole) {
        this.userRole = userWithRole.role;
        this.updateNavItems();
      }
    });
  }
  private updateNavItems() {
    if (this.userRole === UserRole.ADMIN) {
      this.navItems[3] = { label: 'Orders', icon: 'fas fa-store', route: 'admin-orders-page' };
    } else {
      this.navItems[3] = { label: 'My Orders', icon: 'fas fa-box', route: 'user-orders-page' };
    }
  }
  navigate(route: string) {
    // if (route === 'cart-page') {
    //   this.cartModalService.openModal();
    // } else if (route === 'profile-page') {
    //   console.log("[BottomNavigationBarComponent] profileModalService.openModal()");
    //   this.profileModalService.openModal();
    // }
    // else if (route === 'admin-orders-page') {
    //   console.log("[BottomNavigationBarComponent] orderModalService.openModal()");
    //   this.orderModalService.openModal();
    // }
    // // user-orders-page
    // else if (route === 'user-orders-page') {
    //   console.log("[BottomNavigationBarComponent] myOrdersModalService.openModal()");
    //   // this.router.navigate(['/user-orders-page']);
    //   this.myOrdersModalService.openModal();
    // }
    // else {
      this.router.navigate([route]);
    // }
  }
}
