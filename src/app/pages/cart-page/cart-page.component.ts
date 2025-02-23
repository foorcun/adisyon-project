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

  constructor(
    // private cartPageFacadeService: CartPageFacadeService,
    // private cartFirebase2Repository: CartFirebase2Repository,
    private cartService: CartService,
    private router: Router,
    // private cartModalService: CartModalService
  ) {
    this.cart$ = this.cartService.cart$;

    // Subscribe to cart$ to extract and log cart items
    this.cart$.subscribe(cart => {
      // this.cartItems = cart.items || [];
      // console.log('Updated cart itemssssss:', this.cartItems);
      console.log('Updated carttttt:', cart);
    });
  }

  clearCart(): void {
    this.cartService.clearCart("7UMNf9av9YZSU4fUx17D5IGHG6I2"); // Clear the cart via the facade service
  }

  removeItem(productId: string): void {
    // this.cartFirebase2Repository.removeItem(productId); // Remove an item via the facade service
  }

  increaseQuantity(productId: string): void {
    // this.cartFirebase2Repository.increaseQuantity(productId); // Increase item quantity
  }

  decreaseQuantity(productId: string): void {
    // this.cartFirebase2Repository.decreaseQuantity(productId); // Decrease item quantity
  }

  handleClick() {
    this.closeCartModal();
    this.router.navigate(['menu-page']);
  }

  closeCartModal() {
    // this.cartModalService.closeModal();
  }

  createOrder(tableName: string) {
    // this.cartPageFacadeService.createOrder(tableName);
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
