import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';
import { OdemePageFacadeService2 } from '../../../services/odeme-page-facade2.service';
import { BehaviorSubject } from 'rxjs';
import { Payment } from '../../../PaymentFeature/domain/entities/payment.entity';
import { PaymentOrder } from '../../../PaymentFeature/domain/entities/payment-order.entity';
import { PaymentOrderItem } from '../../../PaymentFeature/domain/entities/payment-order-item.entity';

@Component({
  selector: 'app-odeme-page-area1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss',
})
export class OdemePageArea1Component {
  // private orders: Order[] = [];
  private selectedTablePaymentSubject = new BehaviorSubject<Payment | undefined>(undefined);
  selectedTablePayment$ = this.selectedTablePaymentSubject.asObservable();

  private ordersSubject = new BehaviorSubject<PaymentOrder[]>([])
  orders$ = this.ordersSubject.asObservable();

  constructor(
    // public odemePageFacadeService: OdemePageFacadeService
    public odemePageFacadeService: OdemePageFacadeService2
  ) {
    // this.odemePageFacadeService.orders$.pipe(take(1)).subscribe(orders => {
    //   this.orders = orders;
    // });
    this.odemePageFacadeService.selectedTablePayment$.subscribe(selectedTablePayment => {
      if (selectedTablePayment?.orders) {
        console.log("[OdemePageArea1Component] ", selectedTablePayment.orders)
        this.ordersSubject.next(selectedTablePayment.orders)
      }
    });

  }

  // get allItems(): OrderItem[] {
  get allItems() {
    // return this.orders.flatMap(order => order.items);
    return this.ordersSubject.getValue();
  }

  // get unpaidItems(): OrderItem[] {
  get unpaidItems() {
    // return this.allItems.filter(item => this.getPaidCount(item) < item.quantity);
    return this.ordersSubject.getValue();
  }

  get paidItems(): OrderItem[] {
    // return this.allItems.filter(item => this.getPaidCount(item) >= item.quantity);
    return []
  }

  onSelect(item: OrderItem): void {
    this.odemePageFacadeService.selectItem(item);
  }

  onDeselect(event: MouseEvent, item: OrderItem): void {
    event.stopPropagation();
    this.odemePageFacadeService.deselectItem(item);
  }

  isSelected(item: OrderItem): boolean {
    return this.odemePageFacadeService.isSelected(item);
  }

  // getSelectedCount(item: OrderItem): number {
  getSelectedCount(item: PaymentOrder): number {
    return this.odemePageFacadeService.getSelectedCount(item);
  }

  isPaid(item: OrderItem): boolean {
    return this.odemePageFacadeService.isPaid(item);
  }

  getPaidCount(item: OrderItem): number {
  // getPaidCount(item: PaymentOrderItem): number {
    return this.odemePageFacadeService.getPaidCount(item);
  }

  get selectedTotal(): number {
    return this.odemePageFacadeService.selectedTotal;
  }
}
