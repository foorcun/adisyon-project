import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderService } from './order.service';
import { TableDetailsPageFacadeService } from './table-details-page.facade.service';
import { Router } from '@angular/router';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { AdminOrdersPageFacadeService } from './admin-orders-page-facade.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../PaymentFeature/domain/entities/payment-method.enum';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';

@Injectable({
  providedIn: 'root'
})
export class OdemePageFacadeService {

  // ✅ State
  // orders: Order[] = [];
  // table: Table | null = null;
  selectedItems: number[] = [];

  // ✅ Observables (optional)
  private _orders$ = new BehaviorSubject<Order[]>([]);
  orders$ = this._orders$.asObservable();

  total$: Observable<number> = of(0);
  combinedStatuses$: Observable<string> = of('');
  orderIdsString$: Observable<string> = of('');

  private _paymentAmount$ = new BehaviorSubject<string>('');
  paymentAmount$ = this._paymentAmount$.asObservable();

  private tableId: string | null = null;

  public currentPayment$!: Observable<Payment>;


  constructor(
    private orderService: OrderService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    // private adminOrdersPageFacadeService: AdminOrdersPageFacadeService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    console.log('[OdemePageFacadeService] Service initialized');

    // const selectedTable = this.adminOrdersPageFacadeService.selectedTable;
    this.tableDetailsPageFacadeService.table$.pipe(
      tap(table => {
        console.log('[OdemePageFacadeService] Table:', table);
        if (!table) {
          console.warn('[OdemePageFacadeService] No table ID found, redirecting...');
          this.router.navigate(['/admin-orders-page']);
        }
      }),
      filter((table): table is Table => !!table), // ensure table is non-null
      switchMap(table => {
        this.tableId = table.id;
        console.log('[OdemePageFacadeService] Table ID:', this.tableId);

        return this.orderService.orders$.pipe(
          map(orders =>
            orders.filter(order =>
              order.tableUUID === table.id &&
              (order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS)
            )
          )
        );
      })
    ).subscribe(filteredOrders => {
      console.log('[OdemePageFacadeService] Orders updated:', filteredOrders);
      this._orders$.next(filteredOrders);
    });

    // ✅ Track table (if needed)
    // this.tableDetailsPageFacadeService.table$.subscribe(table => {
    //   this.table = table;
    // });

    // ✅ Derived Observables
    // this.total$ = this.orders$.pipe(
    //   map(orders => orders.reduce((sum, order) => sum + order.getTotalAmount(), 0))
    // );

    // this.combinedStatuses$ = this.orders$.pipe(
    //   map(orders => {
    //     const uniqueStatuses = [...new Set(orders.map(order => order.status))];
    //     return uniqueStatuses.join(', ');
    //   })
    // );

    // this.orderIdsString$ = this.orders$.pipe(
    //   map(orders => orders.map(o => o.id).join(', '))
    // );
    
    // ✅ safe to use now
    this.currentPayment$ = this.tableDetailsPageFacadeService.table$.pipe(
      filter((table): table is Table => !!table),
      switchMap(table => this.paymentService.getPaymentByTableId(table.id))
    );
  }


  getSelectedTotal(): number {
    let total = 0;
    console.log('[OdemePageFacadeService] Selected items:', this.selectedItems);

    // this.selectedItems.forEach(index => {
    //   const order = this.orders[index];
    //   if (order) {
    //     total += order.getTotalAmount();
    //   }
    // });

    console.log('[OdemePageFacadeService] Selected total:', total);
    return total;
  }

  updatePaymentAmount(value: string): void {
    const current = this._paymentAmount$.getValue();

    if (value === 'sil') {
      // Clear/reset
      this._paymentAmount$.next('');
    } else if (value === 'tumu') {
      // Set to the full total amount (as string)
      const totalAmount = this.getSelectedTotal();
      this._paymentAmount$.next(totalAmount.toFixed(2));
    } else {
      // Prevent multiple dots
      if (value === '.' && current.includes('.')) {
        return;
      }
      // Append digit/dot
      this._paymentAmount$.next(current + value);
    }

    console.log('[OdemePageFacadeService] Ödenecek Tutar:', this._paymentAmount$.getValue());
  }

  payWithCurrentAmount(method: PaymentMethod): void {
    const tableId = this.tableId;
    const rawAmount = this._paymentAmount$.getValue();
    const amount = Number(rawAmount);

    if (!tableId || isNaN(amount) || amount <= 0) {
      console.warn('[OdemePageFacadeService] Invalid payment attempt.', { tableId, rawAmount });
      return;
    }

    const command = new PaymentCommand(tableId, method, amount);
    this.paymentService.addSubPayment(command).subscribe({
      next: () => {
        console.log('[OdemePageFacadeService] SubPayment successful:', command);
        this._paymentAmount$.next(''); // reset input after payment
      },
      error: err => {
        console.error('[OdemePageFacadeService] SubPayment failed:', err);
      }
    });
  }

}
