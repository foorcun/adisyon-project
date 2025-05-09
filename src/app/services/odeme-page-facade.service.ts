import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderService } from './order.service';
import { TableDetailsPageFacadeService } from './table-details-page.facade.service';
import { Router } from '@angular/router';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { AdminOrdersPageFacadeService } from './admin-orders-page-facade.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OdemePageFacadeService {

  // ✅ Observables
  orders$: Observable<Order[]>;
  table$: Observable<Table | null>;

  // ✅ Derived data
  total$: Observable<number>;
  combinedStatuses$: Observable<string>;
  orderIdsString$: Observable<string>;


  selectedItems: number[] = [];

  // Holds the payment amount as a string (to handle decimals)
  private _paymentAmount$ = new BehaviorSubject<string>('');
  paymentAmount$ = this._paymentAmount$.asObservable();


  constructor(
    private orderService: OrderService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private adminOrdersPageFacadeService: AdminOrdersPageFacadeService,
    private router: Router
  ) {
    console.log('[OdemePageFacadeService] Service initialized');

    const selectedTable = this.adminOrdersPageFacadeService.selectedTable;
    const tableId = selectedTable?.id;

    if (!tableId) {
      console.warn('[OdemePageFacadeService] No table ID found, redirecting...');
      this.router.navigate(['/admin-orders-page']);
    }

    // ✅ Subscribe & filter orders
    this.orders$ = this.orderService.orders$.pipe(
      map(orders =>
        orders.filter(order =>
          order.tableUUID === tableId &&
          (order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS)
        )
      )
    );

    // ✅ Track table
    this.table$ = this.tableDetailsPageFacadeService.table$;

    // ✅ Total amount
    this.total$ = this.orders$.pipe(
      map(orders => orders.reduce((sum, order) => sum + order.getTotalAmount(), 0))
    );

    // ✅ Combined statuses
    this.combinedStatuses$ = this.orders$.pipe(
      map(orders => {
        const uniqueStatuses = [...new Set(orders.map(order => order.status))];
        return uniqueStatuses.join(', ');
      })
    );

    // ✅ Order IDs string
    this.orderIdsString$ = this.orders$.pipe(
      map(orders => orders.map(o => o.id).join(', '))
    );
  }

  getSelectedTotal(): number {
    let total = 0;
    this.orders$.subscribe(orders => {
      total = this.selectedItems.reduce((sum, index) => {
        const order = orders[index];
        return sum + (order ? order.getTotalAmount() : 0);
      }, 0);
    }).unsubscribe();
    return total;
  }

  updatePaymentAmount(value: string): void {
    let current = this._paymentAmount$.getValue();

    if (value === 'sil') {
      // Clear/reset
      this._paymentAmount$.next('');
    } else if (value === 'tumu') {
      // Set to the full total amount (as string)
      this.total$.subscribe(total => {
        this._paymentAmount$.next(total.toFixed(2));
      }).unsubscribe();
    } else {
      // Validate and append numbers/dot

      // Prevent multiple dots
      if (value === '.' && current.includes('.')) {
        return;
      }

      // Append new digit or dot
      this._paymentAmount$.next(current + value);
    }

    console.log('[OdemePageFacadeService] Ödenecek Tutar:', this._paymentAmount$.getValue());
  }

}
