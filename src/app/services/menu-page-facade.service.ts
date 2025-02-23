import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../CartFeature/domain/entity/cart-item';
import { MenuItem } from '../MenuFeature/domain/entity/menuitem.entity';
import { Product } from '../CartFeature/domain/entity/product.entity';

@Injectable({
  providedIn: 'root',
})
export class MenuPageFacadeService {
  private selectedMenuItemSubject = new BehaviorSubject<CartItem | null>(null);
  selectedMenuItem$ = this.selectedMenuItemSubject.asObservable();

  constructor() {}

  /** ✅ Set selected menu item, ensuring `categoryId` is passed */
  setSelectedMenuItem(menuItem: MenuItem, categoryId: string): void {
    const cartItem = this.convertToCartItem(menuItem, categoryId);
    this.selectedMenuItemSubject.next(cartItem);
  }

  /** ✅ Convert `MenuItem` to `CartItem` */
  private convertToCartItem(menuItem: MenuItem, categoryId: string): CartItem {
    const product = new Product(
      menuItem.id,
      menuItem.name,
      menuItem.description,
      menuItem.price,
      menuItem.imageUrl,
      categoryId // ✅ categoryId is explicitly passed
    );

    return new CartItem(product, 1); // Default quantity = 1
  }
}
