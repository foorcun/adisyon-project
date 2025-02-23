import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../CartFeature/domain/entity/cart-item';
import { MenuPageFacadeService } from '../../../services/menu-page-facade.service';

@Component({
  selector: 'app-menu-item-page-footer',
  imports: [CommonModule],
  templateUrl: './menu-item-page-footer.component.html',
  styleUrl: './menu-item-page-footer.component.scss'
})
export class MenuItemPageFooterComponent {
  @Output() addToCartClicked = new EventEmitter<{ quantity: number }>();

  public selectedMenuItem: CartItem | null = null; // ✅ Allow null initially

  quantity: number = -1; // Default quantity

  constructor(
    // private menuItemPageFacadeService: MenuItemPageFacadeService,
    private menuPageFacadeService: MenuPageFacadeService
  ) {
    this.menuPageFacadeService.selectedMenuItem$.subscribe((value) => {
      console.log('selectedMenuItem$ value:', value);
      if (value) {
        this.selectedMenuItem = value;
        this.quantity = value?.quantity; // ✅ Set quantity to 1 if null
      }
    });
  }

  incrementQuantity(): void {
    // this.quantity++;
    // this.menuItemPageFacadeService.incrementQuantity();
    this.menuPageFacadeService.incrementQuantity();
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      // this.quantity--;
      this.menuPageFacadeService.decrementQuantity();
    }
  }

  addToCart(): void {
    this.addToCartClicked.emit({ quantity: this.quantity });
  }
}
