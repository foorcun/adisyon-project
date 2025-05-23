import { Component } from '@angular/core';
import { Category } from '../../../../MenuFeature/domain/entity/category.entity';
import { MenuItem } from '../../../../MenuFeature/domain/entity/menuitem.entity';
import { Subscription } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../../../services/table-details-page.facade.service';
import { CartItem } from '../../../../CartFeature/domain/entity/cart-item';
import { Product } from '../../../../CartFeature/domain/entity/product.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-item-mobile',
  imports: [CommonModule],
  templateUrl: './menu-item-mobile.component.html',
  styleUrl: './menu-item-mobile.component.scss'
})
export class MenuItemMobileComponent {
  selectedCategory: Category | null = null;
  menuItems: MenuItem[] = [];

  private selectedCategorySubscription!: Subscription;

  constructor(private tableDetailsPageFacadeService: TableDetailsPageFacadeService) { }

  ngOnInit(): void {
    this.selectedCategorySubscription = this.tableDetailsPageFacadeService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
      this.menuItems = category ? Object.values(category.menuItems || {}) : [];
    });
  }

  ngOnDestroy(): void {
    if (this.selectedCategorySubscription) this.selectedCategorySubscription.unsubscribe();
  }


  addToCart(menuItem: MenuItem) {
    // console.log(`[MenuItemAreaComponent] - Adding item to cart:`, menuItem);  
    this.tableDetailsPageFacadeService.addItemToCart(
      new CartItem(
        new Product(
          menuItem.id,
          menuItem.name,
          menuItem.description,
          menuItem.price,
          menuItem.imageUrl,
          ""
        ),
        this.getSelectedQuantity()
      )
    );
    this.tableDetailsPageFacadeService.clearSelectedQuantity();
  }

  getSelectedQuantity(): number {
    var selectedQuantity = this.tableDetailsPageFacadeService.selectedQuantity;
    if (selectedQuantity == null) {
      return 1;
    }
    return selectedQuantity;
  }
}
