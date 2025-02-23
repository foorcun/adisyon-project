import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemPageFooterComponent } from './menu-item-page-footer/menu-item-page-footer.component';
import { MenuPageFacadeService } from '../../services/menu-page-facade.service';
import { CartItem } from '../../CartFeature/domain/entity/cart-item';
import { Product } from '../../CartFeature/domain/entity/product.entity';
import { MenuItem } from '../../MenuFeature/domain/entity/menuitem.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item-page',
  imports: [CommonModule, MenuItemPageFooterComponent],
  templateUrl: './menu-item-page.component.html',
  styleUrl: './menu-item-page.component.scss'
})
export class MenuItemPageComponent {
  public selectedMenuItem: CartItem | null = null; // ✅ Allow null initially

  constructor(private menuPageFacadeService: MenuPageFacadeService,
    private router: Router
  ) {
    this.menuPageFacadeService.selectedMenuItem$.subscribe((cartItem: CartItem | null) => {
      console.log('selectedMenuItem$ value:', cartItem);
      if (cartItem) {
        this.selectedMenuItem = cartItem;
      }
      else {
        this.router.navigate(["/menu-page"])
      }
    });
  }

  addToCart() {
    if (this.selectedMenuItem && this.selectedMenuItem) {
      this.menuPageFacadeService.addToCart(this.selectedMenuItem);
      // this.modalService.closeModal();
    } else {
      console.error('No valid item to add to cart');
    }
  }
  /** ✅ Navigate back to the menu page */
  goBackToMenuPage(): void {
    this.router.navigate(['/menu-page']);
  }
}
