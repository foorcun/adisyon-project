import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// import { CategoryProducts } from './models/category-products.entity';
import { CommonModule } from '@angular/common';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';
import { MenuItem } from '../../MenuFeature/domain/entity/menuitem.entity';
import { NavbarBootstrapComponent } from '../../common/navbar-bootstrap/navbar-bootstrap.component';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';

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
  private categoriesSubscription!: Subscription;
  private categoryProductsSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService) { }

  ngOnInit(): void {
    // ✅ Subscribe to categories
    this.categoriesSubscription = this.menuService.categories$.subscribe(categories => {
      this.categories = categories;
      console.log('Categories updated:', this.categories);
    });

    // ✅ Subscribe to categoryProducts
    this.categoryProductsSubscription = this.menuService.categoryProducts$.subscribe(categoryProducts => {
      this.categoryProducts = categoryProducts;
      console.log('Category Products updated:', this.categoryProducts);
    });
  }


  scrollToCategory(categoryId: string) {
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateSiparisDetay(){
    this.router.navigate(['/menu-item-page']);
  }
  /** ✅ Prevent memory leaks */
  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this.categoryProductsSubscription) {
      this.categoryProductsSubscription.unsubscribe();
    }
  }
}

