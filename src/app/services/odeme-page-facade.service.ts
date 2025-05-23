import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../OrderFeature/domain/entities/order.entity';
import { OrderService } from './order.service';
import { TableDetailsPageFacadeService } from './table-details-page.facade.service';
import { Router } from '@angular/router';
import { OrderStatus } from '../OrderFeature/domain/entities/order-status';
import { Table } from '../OrderFeature/domain/entities/table.entity';
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
  public selectedTotal$: Observable<number>;
  public remainingInfo$: Observable<{ label: string; amount: number }>;
  public canCloseTable$: Observable<boolean>;
  public currentPayment$!: Observable<Payment>;

  private tableId: string | null = null;

  private selectedCountMap = new Map<OrderItem, number>();
  private paidCountMap = new Map<OrderItem, number>();

  constructor(
    private orderService: OrderService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private router: Router,
    private paymentService: PaymentService
  ) {
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
          order.items.map(item => new OrderItem(item.product, item.quantity))
        );
        return allItems.reduce((sum, item) => sum + item.getTotalPrice, 0);
      })
    );

    this.subPaymentTotal$ = this.currentPayment$.pipe(
      map(payment =>
        Object.values(payment.subPayments).reduce((sum, sub) => sum + sub.amount, 0)
      )
    );

    this.selectedTotal$ = this.orders$.pipe(
      map(orders => {
        let total = 0;
        for (const order of orders) {
          for (const item of order.items) {
            const count = this.getSelectedCount(item);
            const price = item.product?.price ?? 0;
            total += price * count;
          }
        }
        return total;
      })
    );

    this.remainingInfo$ = this.totalPrice$.pipe(
      switchMap(total =>
        this.subPaymentTotal$.pipe(
          map(paid => {
            const diff = paid - total;
            if (diff < 0) {
              return { label: 'Kalan Tutar', amount: Math.abs(diff) };
            } else if (diff > 0) {
              return { label: 'Para Üstü', amount: diff };
            } else {
              return { label: 'Tam Ödendi', amount: 0 };
            }
          })
        )
      )
    );

    this.canCloseTable$ = this.remainingInfo$.pipe(
      map(info => info.label === 'Tam Ödendi' && info.amount === 0)
    );
  }

  selectItem(item: OrderItem): void {
    if (this.isPaid(item)) return;

    const selected = this.selectedCountMap.get(item) ?? 0;
    const paid = this.paidCountMap.get(item) ?? 0;
    const remaining = item.quantity - paid;

    if (selected < remaining) {
      this.selectedCountMap.set(item, selected + 1);
    } else {
      console.log('Cannot select more than remaining unpaid quantity.');
    }
  }

  deselectItem(item: OrderItem): void {
    const selected = this.selectedCountMap.get(item) ?? 0;

    if (selected > 1) {
      this.selectedCountMap.set(item, selected - 1);
    } else {
      this.selectedCountMap.delete(item);
    }
  }

  isSelected(item: OrderItem): boolean {
    return (this.selectedCountMap.get(item) ?? 0) > 0;
  }

  getSelectedCount(item: OrderItem): number {
    return this.selectedCountMap.get(item) ?? 0;
  }

  isPaid(item: OrderItem): boolean {
    return (this.paidCountMap.get(item) ?? 0) >= item.quantity;
  }

  getPaidCount(item: OrderItem): number {
    return this.paidCountMap.get(item) ?? 0;
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

    const command = new PaymentCommand(this.tableId, method, amount);

    this.paymentService.addSubPayment(command).subscribe({
      next: () => {
        console.log('[OdemePageFacadeService] SubPayment successful:', command);

        this.selectedCountMap.forEach((count, item) => {
          const paid = this.paidCountMap.get(item) ?? 0;
          this.paidCountMap.set(item, paid + count);
        });

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
          next: () => {
            console.log(`[OdemePageFacadeService] SubPayment ${index} deleted.`);
            this.paidCountMap.clear();
            this.tableDetailsPageFacadeService.table$
              .pipe(take(1))
              .subscribe(table => {
                if (table) {
                  this.paymentService.getPaymentByTableId(table.id).subscribe(payment => {
                    console.log('[OdemePageFacadeService] Refreshed payment after delete:', payment);
                  });
                }
              });
          },
          error: err => {
            console.error('[OdemePageFacadeService] Failed to delete subpayment:', err);
          }
        });
      },
      error: err => console.error('[OdemePageFacadeService] Failed to resolve table or payment:', err)
    });
  }

  getPaymentAmount(): number {
    return this._paymentAmount$.getValue() ? parseFloat(this._paymentAmount$.getValue()) : 0;
  }

  closeTableAndSave(): void {
    console.log('[OdemePageFacadeService] Table closure initiated...');
    // TODO: Implement closing logic — set orders to COMPLETED, release table, etc.
  }
}
