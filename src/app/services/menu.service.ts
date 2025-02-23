import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../MenuFeature/domain/entity/category.entity';
import { CategoryProducts } from '../pages/menu-page/menu-page.component';
import { MenuFirebaseRepository } from '../MenuFeature/infrastructure/menu-firebase.repository';
import { Menu } from '../MenuFeature/domain/entity/menu.entity';
import { MenuItem } from '../MenuFeature/domain/entity/menuitem.entity';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private categoriesSubject = new BehaviorSubject<{ [key: string]: Category }>({});
  private categoryProductsSubject = new BehaviorSubject<CategoryProducts[]>([]);

  categories$ = this.categoriesSubject.asObservable();
  categoryProducts$ = this.categoryProductsSubject.asObservable();

  constructor(private menuRepository: MenuFirebaseRepository) {
    this.listenForMenuChanges(); // 🔥 Listen immediately when the service is initialized
  }

  /** ✅ Listen for menu changes */
  private listenForMenuChanges(): void {
    this.menuRepository.listenForMenuChanges();
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        this.categoriesSubject.next(menu.categories);
        this.categoryProductsSubject.next(this.transformToCategoryProducts(menu.categories));
      }
    });
  }

  /** ✅ Get categories */
  getCategories(): { [key: string]: Category } {
    return this.categoriesSubject.getValue();
  }

  /** ✅ Get transformed category products */
  getCategoryProducts(): CategoryProducts[] {
    return this.categoryProductsSubject.getValue();
  }

  /** ✅ Transform menu data into category-based product list */
  private transformToCategoryProducts(categories: { [key: string]: Category }): CategoryProducts[] {
    return Object.entries(categories).map(([categoryId, category]) => {
      const menuItemsArray = Object.entries(category.menuItems || {}).map(([menuItemId, menuItem]) => ({
        id: menuItemId,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl
      }));

      return {
        category: {
          id: categoryId,
          name: category.name,
          imageUrl: category.imageUrl,
          menuItems: category.menuItems
        },
        menuItems: menuItemsArray
      };
    });
  }

  /** ✅ Create a menu */
  createMenu(menu: Menu): Observable<void> {
    return this.menuRepository.addMenu(menu);
  }

  /** ✅ Update a menu */
  updateMenu(menuKey: string, updates: Partial<Menu>): Observable<void> {
    return this.menuRepository.updateMenu(menuKey, updates);
  }

  /** ✅ Delete a menu */
  deleteMenu(menuKey: string): Observable<void> {
    return this.menuRepository.removeMenu(menuKey);
  }

  /** ✅ Add a category */
  addCategory(menuKey: string, category: Category): Observable<void> {
    return this.menuRepository.addCategory( category);
  }

  /** ✅ Update a category name */
  updateCategoryName(menuKey: string, categoryId: string, newName: string): Observable<void> {
    return this.menuRepository.updateCategoryName( categoryId, newName);
  }

  /** ✅ Remove a category */
  removeCategory(menuKey: string, categoryId: string): Observable<void> {
    return this.menuRepository.removeCategory( categoryId);
  }

  /** ✅ Add a menu item */
  addMenuItem(menuKey: string, categoryId: string, menuItem: MenuItem): Observable<void> {
    return this.menuRepository.addMenuItem(menuKey, categoryId, menuItem);
  }

  /** ✅ Update a menu item */
  updateMenuItem(menuKey: string, categoryId: string, menuItemId: string, updates: Partial<MenuItem>): Observable<void> {
    return this.menuRepository.updateMenuItem(menuKey, categoryId, menuItemId, updates);
  }

  /** ✅ Remove a menu item */
  removeMenuItem(menuKey: string, categoryId: string, menuItemId: string): Observable<void> {
    return this.menuRepository.removeMenuItem(menuKey, categoryId, menuItemId);
  }
}
