import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderService } from './order.service';
import { TableDetailsPageFacadeService } from './table-details-page.facade.service';
import { Router } from '@angular/router';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../PaymentFeature/domain/entities/payment-method.enum';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { OrderItem } from '../OrderFeature/domain/entities/order-item.entity';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OdemePageFacadeService {
  private _orders$ = new BehaviorSubject<Order[]>([]);
  orders$ = this._orders$.asObservable();

  private _paymentAmount$ = new BehaviorSubject<string>('');
  paymentAmount$ = this._paymentAmount$.asObservable();

  public totalPrice$: Observable<number>;
  public subPaymentTotal$: Observable<number>;
  public currentPayment$!: Observable<Payment>;

  private tableId: string | null = null;

  // 🟣 Selection state
  private selectedCountMap = new Map<OrderItem, number>();

  constructor(
    private orderService: OrderService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    console.log('[OdemePageFacadeService] Service initialized');

    this.tableDetailsPageFacadeService.table$.pipe(
      tap(table => {
        if (!table) {
          console.warn('[OdemePageFacadeService] No table ID found, redirecting...');
          this.router.navigate(['/admin-orders-page']);
        }
      }),
      filter((table): table is Table => !!table),
      switchMap(table => {
        this.tableId = table.id;
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
      this._orders$.next(filteredOrders);
    });

    this.currentPayment$ = this.tableDetailsPageFacadeService.table$.pipe(
      filter((table): table is Table => !!table),
      switchMap(table => this.paymentService.getPaymentByTableId(table.id))
    );

    this.totalPrice$ = this.orders$.pipe(
      map(orders => {
        if (!orders || orders.length === 0) return 0;

        const allItems = orders.flatMap(order =>
          order.items.map(item => {
            const hydrated = new OrderItem(item.product, item.quantity);
            hydrated.urunNotu = item.urunNotu;
            return hydrated;
          })
        );

        return allItems.reduce((sum, item) => sum + item.getTotalPrice, 0);
      })
    );

    this.subPaymentTotal$ = this.currentPayment$.pipe(
      map(payment =>
        Object.values(payment.subPayments).reduce((sum, sub) => sum + sub.amount, 0)
      )
    );
  }

  // 🟣 Selection logic (moved from component)

  selectItem(item: OrderItem): void {
    const selectedCount = this.selectedCountMap.get(item) ?? 0;

    if (selectedCount < item.quantity) {
      this.selectedCountMap.set(item, selectedCount + 1);
    } else {
      console.log('Already selected max quantity of this item.');
    }
  }

  deselectItem(item: OrderItem): void {
    const selectedCount = this.selectedCountMap.get(item) ?? 0;

    if (selectedCount > 1) {
      this.selectedCountMap.set(item, selectedCount - 1);
    } else {
      this.selectedCountMap.delete(item);
    }
  }

  isSelected(item: OrderItem): boolean {
    return this.selectedCountMap.has(item);
  }

  getSelectedCount(item: OrderItem): number {
    return this.selectedCountMap.get(item) ?? 0;
  }

  get selectedTotal(): number { // selectedTotal price burda
    let total = 0;
    this.selectedCountMap.forEach((count, item) => {
      const unitPrice = item.product?.price ?? 0;
      total += unitPrice * count;
    });
    return total;
  }

  updatePaymentAmount(value: string): void {
    const current = this._paymentAmount$.getValue();

    if (value === 'sil') {
      this._paymentAmount$.next('');
    } else if (value === 'tumu') {
      const totalAmount = this.selectedTotal;
      this._paymentAmount$.next(totalAmount.toFixed(2));
    } else {
      if (value === '.' && current.includes('.')) return;
      this._paymentAmount$.next(current + value);
    }

    console.log('[OdemePageFacadeService] Ödenecek Tutar:', this._paymentAmount$.getValue());
  }

  pay(amount: number, method: PaymentMethod): void {
    if (!this.tableId) {
      console.warn('[OdemePageFacadeService] Cannot process payment — no table ID.');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      console.warn('[OdemePageFacadeService] Invalid payment amount:', amount);
      return;
    }

    const command = new PaymentCommand(this.tableId, method, amount);

    this.paymentService.addSubPayment(command).subscribe({
      next: () => {
        console.log('[OdemePageFacadeService] SubPayment successful:', command);
        this._paymentAmount$.next(''); // Clear input after payment
      },
      error: err => {
        console.error('[OdemePageFacadeService] SubPayment failed:', err);
      }
    });
  }


  deleteSubPaymentAtIndex(index: string): void {
    this.currentPayment$.pipe(
      take(1),
      withLatestFrom(this.tableDetailsPageFacadeService.table$)
    ).subscribe({
      next: ([payment, table]) => {
        if (!table) {
          console.warn('[OdemePageFacadeService] Table not found.');
          return;
        }

        const tableId = table.id;
        const keyToDelete = index;

        if (!keyToDelete) {
          console.warn('[OdemePageFacadeService] Subpayment key not found at index:', index);
          return;
        }

        this.paymentService.deleteSubPayment(tableId, keyToDelete).subscribe({
          next: () => console.log(`[OdemePageFacadeService] SubPayment ${index} deleted.`),
          error: err => console.error('[OdemePageFacadeService] Failed to delete subpayment:', err)
        });
      },
      error: err => console.error('[OdemePageFacadeService] Failed to resolve table or payment:', err)
    });
  }

  getPaymentAmount(): number {
    return this._paymentAmount$.getValue() ? parseFloat(this._paymentAmount$.getValue()) : 0;
  }
}
