import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService } from './table.service';
import { OrderService } from './order.service';
import { MenuService } from './menu.service';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { Category } from '../MenuFeature/domain/entity/category.entity';
import { Cart } from '../CartFeature/domain/entity/cart';
import { CartItem } from '../CartFeature/domain/entity/cart-item';

@Injectable({
  providedIn: 'root'
})
export class TableDetailsPageFacadeService {
  private tableSubject = new BehaviorSubject<Table | null>(null);
  table$ = this.tableSubject.asObservable();

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string>('');
  error$ = this.errorSubject.asObservable();

  private selectedCategorySubject = new BehaviorSubject<Category | null>(null);
  selectedCategory$ = this.selectedCategorySubject.asObservable(); // ✅ Expose as Observable

  private activeCartSubject = new BehaviorSubject<Cart | null>(null);
  activeCart$ = this.activeCartSubject.asObservable(); // ✅ Expose as Observable

  constructor(
    private tableService: TableService,
    private orderService: OrderService,
    private menuService: MenuService
  ) {
    // this.heartBeat();
    this.activeCartSubject.next(new Cart('active-cart'));
  }

  /** ✅ Log a Heartbeat Message */
  heartBeat(): void {
    console.log("[TableDetailsPageFacadeService] - Heartbeat, I'm alive!");
  }

  /** ✅ Fetch Table Details */
  fetchTableDetails(tableId: string): void {
    const table = this.tableService.getTables()[tableId] || null;
    this.tableSubject.next(table);

    if (table) {
      this.fetchOrdersForTable(table.name);
    } else {
      this.errorSubject.next('Table not found.');
    }
  }

  /** ✅ Fetch Orders for a Table */
  fetchOrdersForTable(tableUUID: string): void {
    this.loadingSubject.next(true);
    this.orderService.orders$.subscribe({
      next: (orders) => {
        const filteredOrders = Object.values(orders).filter(order => order.tableUUID === tableUUID);
        this.ordersSubject.next(filteredOrders);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error(error);
        this.errorSubject.next('Error fetching orders.');
        this.loadingSubject.next(false);
      }
    });
  }

  /** ✅ Fetch Categories */
  fetchCategories(): void {
    this.loadingSubject.next(true);
    this.menuService.categories$.pipe(
      map(categoriesObj =>
        Object.entries(categoriesObj || {}).map(([id, category]) => ({
          id,
          name: category.name as string,
          menuItems: category.menuItems || {},
          imageUrl: category.imageUrl || ''
        }))
      )
    ).subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error(error);
        this.errorSubject.next('Error fetching categories.');
        this.loadingSubject.next(false);
      }
    });
  }

  /** ✅ Get Latest Values Without Using Observables */
  getTable(): Table | null {
    return this.tableSubject.getValue();
  }

  getOrders(): Order[] {
    return this.ordersSubject.getValue();
  }

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getLoading(): boolean {
    return this.loadingSubject.getValue();
  }

  getErrorMessage(): string {
    return this.errorSubject.getValue();
  }

  /** ✅ Handle Back Navigation */
  goBack(): void {
    window.history.back();
  }

  /** ✅ Set the selected category */
  setSelectedCategory(category: Category): void {
    console.log(`[TableDetailsPageFacadeService] - Selected Category:`, category);
    this.selectedCategorySubject.next(category);
  }

  /** ✅ Add Item to Cart */
  addItemToCart(cartItem: CartItem): void {
    const activeCart = this.activeCartSubject.getValue();
    if (activeCart) {
      activeCart.addItem(cartItem);
    } else {
      console.error('Active cart is null.');
    }
  }
}