import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { PaymentMethod } from '../PaymentFeature/domain/entities/payment-method.enum';
import { PaymentOrderItem } from '../PaymentFeature/domain/entities/payment-order-item.entity';

import { PaymentService } from './payment.service';
import { TableDetailsPageFacadeService } from './table-details-page.facade.service';
import { TableService } from './table.service';
import { TableStatus } from '../OrderFeature/domain/entities/table-status.enum';
import { ArchivedPayment } from '../ArchivedPaymentFeature/domain/entities/archived-payment.entity';
import { ArchivedPaymentService } from './archived-payment.service';
import { PaymentOrder } from '../PaymentFeature/domain/entities/payment-order.entity';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class OdemePageFacadeService2 {
  private _orders$ = new BehaviorSubject<PaymentOrder[]>([]);
  orders$ = this._orders$.asObservable();

  private _paymentAmount$ = new BehaviorSubject<string>('');
  paymentAmount$ = this._paymentAmount$.asObservable();

  public selectedTablePayment$!: Observable<Payment | undefined>;
  public currentPayment$!: Observable<Payment>;

  public totalPrice$: Observable<number>;
  public subPaymentTotal$: Observable<number>;
  public selectedTotal$: Observable<number>;
  public remainingInfo$: Observable<{ label: string; amount: number }>;
  public canCloseTable$: Observable<boolean>;

  public paidCountMap$ = new BehaviorSubject<Map<string, number>>(new Map());

  private tableId: string | null = null;
  private selectedCountMap = new Map<PaymentOrderItem, number>();

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private router: Router,
    private paymentService: PaymentService,
    private tableService: TableService,
    private archivedPaymentService: ArchivedPaymentService,
    private orderService: OrderService
  ) {
    this.selectedTablePayment$ = this.paymentService.selectedTablePayment$;

    // ✅ Set table ID and initialize related logic
    this.tableDetailsPageFacadeService.table$
      .pipe(filter((table): table is Table => !!table))
      .subscribe((table) => {
        console.log('[OdemePageFacadeService2] selected Table', table);
        this.tableId = table.id;

        this.currentPayment$ = this.paymentService.getPaymentByTableId(table.id);

        this.selectedTablePayment$
          .pipe(map(payment => payment?.orders ?? []))
          .subscribe(paymentOrders => {
            console.log('[OdemePageFacadeService2] paymentOrders', paymentOrders);
            this._orders$.next(paymentOrders);
          });
      });

    this.selectedTablePayment$.subscribe(payment => {
      const map = new Map<string, number>();
      payment?.orders?.forEach(order =>
        order.items.forEach(item => {
          const current = map.get(item.product.id) ?? 0;
          map.set(item.product.id, current + item.paidQuantity);
        })
      );
      this.paidCountMap$.next(map);
    });

    this.totalPrice$ = this.selectedTablePayment$.pipe(
      map(payment => {
        const allItems = payment?.orders.flatMap(order => order.items) ?? [];
        return allItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      })
    );

    this.subPaymentTotal$ = this.selectedTablePayment$.pipe(
      filter((payment): payment is Payment => !!payment),
      map(payment =>
        Object.values(payment.subPayments).reduce((sum, sub) => sum + sub.amount, 0)
      )
    );

    this.selectedTotal$ = combineLatest([
      this.selectedTablePayment$,
      this.paidCountMap$
    ]).pipe(
      map(([payment, paidMap]) => {
        const allItems = payment?.orders.flatMap(order => order.items) ?? [];
        return allItems.reduce((total, item) => {
          const count = this.getSelectedCount(item);
          return total + (item.product?.price ?? 0) * count;
        }, 0);
      })
    );

    this.remainingInfo$ = this.totalPrice$.pipe(
      switchMap(total =>
        this.subPaymentTotal$.pipe(
          map(paid => {
            const diff = paid - total;
            return {
              label: diff < 0 ? 'Kalan Tutar' : diff > 0 ? 'Para Üstü' : 'Tam Ödendi',
              amount: Math.abs(diff)
            };
          })
        )
      )
    );

    this.canCloseTable$ = this.remainingInfo$.pipe(
      map(info => info.label === 'Tam Ödendi' && info.amount === 0)
    );
  }

  selectItem(item: PaymentOrderItem): void {
    this.paidCountMap$.pipe(take(1)).subscribe(paidMap => {
      const selected = this.selectedCountMap.get(item) ?? 0;
      const paid = paidMap.get(item.product.id) ?? 0;
      const remaining = item.quantity - paid;

      if (selected < remaining) {
        this.selectedCountMap.set(item, selected + 1);
      }
    });
  }

  deselectItem(item: PaymentOrderItem): void {
    const selected = this.selectedCountMap.get(item) ?? 0;
    if (selected > 1) {
      this.selectedCountMap.set(item, selected - 1);
    } else {
      this.selectedCountMap.delete(item);
    }
  }

  isSelected(item: PaymentOrderItem): boolean {
    return (this.selectedCountMap.get(item) ?? 0) > 0;
  }

  getSelectedCount(item: PaymentOrderItem): number {
    return this.selectedCountMap.get(item) ?? 0;
  }

  isPaid(item: PaymentOrderItem): boolean {
    return this.getPaidCount(item) >= item.quantity;
  }

  getPaidCount(item: PaymentOrderItem): number {
    const map = this.paidCountMap$.getValue();
    return map.get(item.product.id) ?? 0;
  }

  get selectedTotal(): number {
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

    const subPaymentItems = Array.from(this.selectedCountMap.entries())
      .filter(([item, count]) => count > 0)
      .map(([item, count]) => ({
        productId: item.product.id,
        quantity: count
      }));

    const command = new PaymentCommand(this.tableId, method, amount, subPaymentItems);

    this.paymentService.addSubPayment(command).subscribe({
      next: () => {
        console.log('[OdemePageFacadeService] SubPayment successful:', command);
        this.selectedCountMap.clear();
        this._paymentAmount$.next('');
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
        if (!table) return;

        this.paymentService.deleteSubPayment(table.id, index).subscribe({
          next: () => {
            this.paidCountMap$.next(new Map());
            this.paymentService.getPaymentByTableId(table.id).subscribe(); // Trigger refresh
          },
          error: err => console.error('[OdemePageFacadeService] Failed to delete subpayment:', err)
        });
      }
    });
  }

  getPaymentAmount(): number {
    const raw = this._paymentAmount$.getValue();
    return raw ? parseFloat(raw) : 0;
  }

  closeTableAndSave(): void {
    console.log('[OdemePageFacadeService][OrderFirebaseRepository] Table closure initiated...');

    const selectedTable = this.tableService.getSelectedTable();
    if (!selectedTable) {
      console.warn('[OdemePageFacadeService][OrderFirebaseRepository] No table selected.');
      return;
    } else {
      console.log('[OdemePageFacadeService][OrderFirebaseRepository] Selected Table:', selectedTable);
    }

    const currentPayment = this.paymentService.getPaymentByTableIdSync(selectedTable.id);
    if (!currentPayment) {
      console.warn('[OdemePageFacadeService][OrderFirebaseRepository] No active payment found.');
      return;
    } else {
      console.log('[OdemePageFacadeService][OrderFirebaseRepository] Current Payment:', currentPayment);
    }

    const archivedPayment = new ArchivedPayment(
      currentPayment.tableId,
      currentPayment.totalAmount,
      currentPayment.subPayments,
      true,
      currentPayment.createdAt,
      new Date(), // closedAt
      currentPayment.orders
    );

    console.log('[OdemePageFacadeService] Archived Payment:', archivedPayment);

    this.archivedPaymentService.addArchivedPayment(archivedPayment).subscribe({
      next: () => {
        console.log('[OdemePageFacadeService] ArchivedPayment saved.');

        this.orderService.deleteOrdersByTableId(selectedTable.id).subscribe({
          next: () => {
            console.log('[OdemePageFacadeService] Orders deleted successfully.');
            console.log('[OdemePageFacadeService] Closing table...', selectedTable.id);

            // After deleting orders, we can archive the payment
            // this.archivePayment(currentPayment, selectedTable);
            // delete subpayment with tableId
            this.paymentService.deletePayment(selectedTable.id).subscribe({
              next: () => {
                console.log('[OdemePageFacadeService] Payment deleted successfully.');
              },
              error: (err) => {
                console.error('[OdemePageFacadeService] Error deleting payment:', err);
              }
            });
          },
          error: (err) => {
            console.error('[OdemePageFacadeService] Error deleting orders:', err);
          }
        }
        );
        // this.tableService.updateTableStatus(selectedTable.id, TableStatus.Available).subscribe(() => {
        //   console.log('[OdemePageFacadeService] Table marked as available.');

        //   this.paymentService.deletePayment(selectedTable.id).subscribe(() => {
        //     console.log('[OdemePageFacadeService] Original Payment deleted.');
        //   });
        // });
      },
      error: (err) => {
        console.error('[OdemePageFacadeService] Error archiving payment:', err);
      },
    });
  }
}
