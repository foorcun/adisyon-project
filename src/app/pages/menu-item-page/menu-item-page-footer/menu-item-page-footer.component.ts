import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../CartFeature/domain/entity/cart-item';

@Component({
  selector: 'app-menu-item-page-footer',
  imports: [CommonModule],
  templateUrl: './menu-item-page-footer.component.html',
  styleUrl: './menu-item-page-footer.component.scss'
})
export class MenuItemPageFooterComponent {
  @Output() addToCartClicked = new EventEmitter<{ quantity: number }>();

  selectedMenuItem = {} as CartItem;

  quantity: number = 1; // Default quantity

  constructor(
    // private menuItemPageFacadeService: MenuItemPageFacadeService,
  ) {
    // this.menuItemPageFacadeService.selectedMenuItem$.subscribe((value) => {
    //   console.log('selectedMenuItem$ value:', value);
    //   this.selectedMenuItem = value;
    // });
  }

  incrementQuantity(): void {
    this.quantity++;
    // this.menuItemPageFacadeService.incrementQuantity();
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    // this.menuItemPageFacadeService.decrementQuantity();
    }
  }

  addToCart(): void {
    this.addToCartClicked.emit({ quantity: this.quantity });
  }
}
