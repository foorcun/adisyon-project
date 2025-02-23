import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { CommonModule } from '@angular/common';
import { CartFirebase2Repository } from '../../../CartFeature/infrastructure/repositories/cart-firebase2.repository';

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
    private cartFirebase2Repository: CartFirebase2Repository
  ) {
    this.cart$ = this.cartFirebase2Repository.cart$;
  }


  closeCartModal() {
    // this.cartModalService.closeModal();
  }

  clearCart() {
    console.log("Clear Cart called")
    // this.cartPageFacadeService.clearCart();
  }

}
