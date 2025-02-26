import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Category } from '../../../MenuFeature/domain/entity/category.entity';
import { MenuItem } from '../../../MenuFeature/domain/entity/menuitem.entity';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { CartItem } from '../../../CartFeature/domain/entity/cart-item';
import { Product } from '../../../CartFeature/domain/entity/product.entity';

@Component({
  selector: 'app-menu-item-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-area.component.html',
  styleUrls: ['./menu-item-area.component.scss']
})
export class MenuItemAreaComponent implements OnInit, OnDestroy {
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
        1)
    );

  }
}
