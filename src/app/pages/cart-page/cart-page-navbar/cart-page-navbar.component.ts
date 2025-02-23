import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { CommonModule } from '@angular/common';
import { CartFirebase2Repository } from '../../../CartFeature/infrastructure/repositories/cart-firebase2.repository';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart-page-navbar',
  imports: [CommonModule],
  templateUrl: './cart-page-navbar.component.html',
  styleUrl: './cart-page-navbar.component.scss'
})
export class CartPageNavbarComponent {

  cart$: Observable<Cart>;

  constructor(
    // private cartModalService: CartModalService,
    // private cartPageFacadeService: CartPageFacadeService
    // private cartFirebase2Repository: CartFirebase2Repository,
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }


  closeCartPage() {
    // this.cartModalService.closeModal();
    this.router.navigate(["/menu-page"]);
  }

  clearCart() {
    console.log("Clear Cart called")
    // this.cartPageFacadeService.clearCart();
    this.cartService.clearCart("7UMNf9av9YZSU4fUx17D5IGHG6I2");
  }

}
