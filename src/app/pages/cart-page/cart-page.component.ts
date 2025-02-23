import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../CartFeature/domain/entity/cart';
import { CommonModule } from '@angular/common';
import { QuantityButtonGroupComponent } from './quantity-button-group/quantity-button-group.component';
import { CartItem } from '../../CartFeature/domain/entity/cart-item';
import { Router } from '@angular/router';
import { TableNameSelectorComponent } from './table-name-selector/table-name-selector.component';
import { OrderNowFooterComponent } from './order-now-footer/order-now-footer.component';
import { IconButtonComponent } from '../../common/icon-button/icon-button.component';
import { CartFirebase2Repository } from '../../CartFeature/infrastructure/repositories/cart-firebase2.repository';
import { CartPageNavbarComponent } from './cart-page-navbar/cart-page-navbar.component';
import { CartService } from '../../services/cart.service';
import { filter, take } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';
import { OrderItem } from '../../OrderFeature/domain/entities/order-item.entity';
import { OrderDto } from '../../OrderFeature/domain/entities/order.dto';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  imports: [CommonModule, CartPageNavbarComponent,
    QuantityButtonGroupComponent,
    IconButtonComponent, TableNameSelectorComponent, OrderNowFooterComponent]
})
export class CartPageComponent {
  cart$: Observable<Cart>;
  cartItems: CartItem[] = []; // Local list of items

  availableTables: string[] = ['Table 1', 'Table 2', 'Table 3', 'Table 4']; // Example table names
  selectedTable: string | null = null; // Currently selected table name
  errorMessage: string | null = null; // To display error messages

  currentUserWithRole: UserWithRole | null = null;

  constructor(
    // private cartPageFacadeService: CartPageFacadeService,
    // private cartFirebase2Repository: CartFirebase2Repository,
    private cartService: CartService,
    private router: Router,
    // private cartModalService: CartModalService
    private userService: UserService
  ) {
    this.cart$ = this.cartService.cart$;

    // Subscribe to cart$ to extract and log cart items
    this.cart$.subscribe(cart => {
      // this.cartItems = cart.items || [];
      // console.log('Updated cart itemssssss:', this.cartItems);
      console.log('Updated carttttt:', cart);
    });

    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
    });
  }

  clearCart(): void {
    this.cartService.clearCart(this.currentUserWithRole!.firebaseUser.uid); // Clear the cart via the facade service
  }

  removeItem(productId: string): void {
    // this.cartFirebase2Repository.removeItem(productId); // Remove an item via the facade service
    this.cartService.removeItem(this.currentUserWithRole!.firebaseUser.uid, productId);
  }


  increaseQuantity(productId: string): void {
    this.cartService.cart$.pipe(take(1)).subscribe(cart => {
      if (cart.items && typeof cart.items === 'object') {
        const item = Object.values(cart.items).find(item => item.product.id === productId);
        if (item) {
          console.log('Item found:', item);
          const newQuantity = item.quantity + 1;
          this.cartService.updateItemQuantity(this.currentUserWithRole!.firebaseUser.uid, productId, newQuantity);
        }
      }
    });
  }


  decreaseQuantity(productId: string): void {
    this.cartService.cart$.pipe(take(1)).subscribe(cart => {
      if (cart.items && typeof cart.items === 'object') {
        const item = Object.values(cart.items).find(item => item.product.id === productId);
        if (item) {
          console.log('Item found:', item);
          const newQuantity = item.quantity - 1;
          this.cartService.updateItemQuantity(this.currentUserWithRole!.firebaseUser.uid, productId, newQuantity);
        }
      }
    });

  }

  handleClick() {
    this.closeCartModal();
    this.router.navigate(['/menu-page']);
  }

  closeCartModal() {
    // this.cartModalService.closeModal();
  }

createOrder(tableName: string) {
  console.log("[CartPageComponent] createOrder: ", tableName);

  this.cartService.cart$.pipe(take(1)).subscribe(cart => {
    if (cart.items && typeof cart.items === 'object') {
      const orderItems = Object.values(cart.items).map(item => {
        return new OrderItem(item.product, item.quantity);
      });

      // Convert Order to Firestore-compatible DTO
      const orderDto: OrderDto = {
        id: '',
        items: orderItems,
        tableName: tableName,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalAmount: 0,
        userUid: this.currentUserWithRole!.firebaseUser.uid,
      };

      this.cartService.createOrder(orderDto).subscribe(orderId => {
        console.log('Order created successfully:', orderId);
        this.clearCart();
      });
    }
  });
}



  onTableNameSelected(tableName: string): void {
    this.selectedTable = tableName;
    this.errorMessage = null; // Clear the error message when a table is selected
    console.log('Selected table:', this.selectedTable);
  }

  onOrderNow(): void {
    if (this.selectedTable) {
      this.createOrder(this.selectedTable);
      this.errorMessage = null; // Clear error on successful order
    } else {
      this.errorMessage = 'Please select a table to create an order.'; // Set error message
    }
  }
}
