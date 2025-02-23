import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// import { CategoryProducts } from './models/category-products.entity';
import { CommonModule } from '@angular/common';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { MenuItem } from '../../MenuFeature/domain/entity/menuitem.entity';
import { NavbarBootstrapComponent } from '../../common/navbar-bootstrap/navbar-bootstrap.component';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { MenuPageFacadeService } from '../../services/menu-page-facade.service';
import { CartItem } from '../../CartFeature/domain/entity/cart-item';

export interface CategoryProducts {
  category: Category;
  menuItems: MenuItem[];
}

@Component({
  selector: 'app-menu-page',
  imports: [CommonModule, NavbarBootstrapComponent],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent implements OnInit, OnDestroy {
  categories: { [key: string]: Category } = {};
  categoryProducts: CategoryProducts[] = [];
  selectedMenuItem: CartItem | null = null; // ✅ Correct type

  private categoriesSubscription!: Subscription;
  private categoryProductsSubscription!: Subscription;
  private selectedMenuItemSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private menuPageFacadeService: MenuPageFacadeService
  ) {}

  ngOnInit(): void {
    // ✅ Subscribe to categories
    this.categoriesSubscription = this.menuService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    // ✅ Subscribe to categoryProducts
    this.categoryProductsSubscription = this.menuService.categoryProducts$.subscribe(categoryProducts => {
      this.categoryProducts = categoryProducts;
    });

    // ✅ Subscribe to selected menu item
    this.selectedMenuItemSubscription = this.menuPageFacadeService.selectedMenuItem$.subscribe(cartItem => {
      this.selectedMenuItem = cartItem;
    });
  }

  /** ✅ Scroll to category section */
  scrollToCategory(categoryId: string) {
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** ✅ Select a menu item with its categoryId */
  selectMenuItem(menuItem: MenuItem, categoryId: string) {
    this.menuPageFacadeService.setSelectedMenuItem(menuItem, categoryId);
  }

  /** ✅ Navigate only if an item is selected */
  navigateSiparisDetay() {
    if (this.selectedMenuItem) {
      console.log('Navigating with selected menu item:', this.selectedMenuItem);
      this.router.navigate(['/menu-item-page']);
    }
  }

  /** ✅ Prevent memory leaks */
  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
    this.categoryProductsSubscription?.unsubscribe();
    this.selectedMenuItemSubscription?.unsubscribe();
  }
}

