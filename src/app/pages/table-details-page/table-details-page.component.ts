import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CategoryAreaComponent } from './category-area/category-area.component';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { TableDetailsPageFacadeService } from '../../services/table-details-page.facade.service';
import { MenuItemAreaComponent } from './menu-item-area/menu-item-area.component';
import { CartAreaComponent } from './cart-area/cart-area.component';

@Component({
  selector: 'app-table-details-page',
  templateUrl: './table-details-page.component.html',
  styleUrls: ['./table-details-page.component.scss'],
  standalone: true,
  imports: [CommonModule, CategoryAreaComponent, MenuItemAreaComponent, CartAreaComponent]
})
export class TableDetailsPageComponent implements OnInit, OnDestroy {
  table: Table | null = null;
  orders: Order[] = [];
  categories: Category[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  quantities: number[] = [0.5, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];




  private tableSubscription!: Subscription;
  private ordersSubscription!: Subscription;
  private categoriesSubscription!: Subscription;
  private loadingSubscription!: Subscription;
  private errorSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private router: Router
  ) {
    this.tableDetailsPageFacadeService.heartBeat();
  }

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('id');
    if (tableId) {
      this.tableDetailsPageFacadeService.fetchTableDetails(tableId);
    }


    this.tableDetailsPageFacadeService.fetchCategories();

    // ✅ Manual subscriptions
    this.tableSubscription = this.tableDetailsPageFacadeService.table$.subscribe(table => {
      this.table = table;
    });

    this.ordersSubscription = this.tableDetailsPageFacadeService.orders$.subscribe(orders => {
      this.orders = orders;
    });

    this.categoriesSubscription = this.tableDetailsPageFacadeService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    this.loadingSubscription = this.tableDetailsPageFacadeService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.errorSubscription = this.tableDetailsPageFacadeService.error$.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
    });

  }

  /** ✅ Cleanup subscriptions */
  ngOnDestroy(): void {
    if (this.tableSubscription) this.tableSubscription.unsubscribe();
    if (this.ordersSubscription) this.ordersSubscription.unsubscribe();
    if (this.categoriesSubscription) this.categoriesSubscription.unsubscribe();
    if (this.loadingSubscription) this.loadingSubscription.unsubscribe();
    if (this.errorSubscription) this.errorSubscription.unsubscribe();
  }

  goBack(): void {
    this.tableDetailsPageFacadeService.goBack();
  }
  goOdemePage() {
    // this.router.navigate(['/odeme-page']);
    this.router.navigate(['/odeme-page', this.table?.id]);
  }

  selectQuantity(quantity: number) {
    console.log("Selected quantity:", quantity);
    // You can store the selected quantity in a variable or pass it to a service
  }
}
