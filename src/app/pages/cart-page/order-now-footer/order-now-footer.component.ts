import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { Observable } from 'rxjs';
import { CartItem } from '../../../CartFeature/domain/entity/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-now-footer',
  templateUrl: './order-now-footer.component.html',
  styleUrls: ['./order-now-footer.component.scss'],
  imports: [CommonModule]
})
export class OrderNowFooterComponent {
  @Output() orderNowClicked = new EventEmitter<void>(); // Emits when the "Order Now" button is clicked


  cart$: Observable<Cart>;
  // cartItems: CartItem[] = []; // Local list of items
  totalAmount: number = -1;

  constructor(
    private cartService: CartService
  ) {
    this.cart$ = this.cartService.cart$;
  }

  getTotalPrice(): number {
    // return this.cartItems.reduce((total, item) => total + item.price, 0);
    this.cart$.subscribe(cart => {
      this.totalAmount = cart.totalAmount
    }
    )
    return this.totalAmount;
  }

  onOrderNow(): void {
    this.orderNowClicked.emit();
  }
}
