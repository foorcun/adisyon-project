import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';
import { OdemePageFacadeService2 } from '../../../services/odeme-page-facade2.service';
import { BehaviorSubject } from 'rxjs';
import { Payment } from '../../../PaymentFeature/domain/entities/payment.entity';
import { PaymentOrder } from '../../../PaymentFeature/domain/entities/payment-order.entity';
import { PaymentOrderItem } from '../../../PaymentFeature/domain/entities/payment-order-item.entity';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-odeme-page-area1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss',
})
export class OdemePageArea1Component {

  private selectedTablePaymentSubject = new BehaviorSubject<Payment | undefined>(undefined);
  selectedTablePayment$ = this.selectedTablePaymentSubject.asObservable();

  private ordersSubject = new BehaviorSubject<PaymentOrder[]>([]);
  orders$ = this.ordersSubject.asObservable();

  productPaidMap: Map<string, number> = new Map();

  constructor(
    public odemePageFacadeService: OdemePageFacadeService2,
    public paymentService: PaymentService
  ) {
    this.odemePageFacadeService.selectedTablePayment$.subscribe(selectedTablePayment => {
      if (selectedTablePayment?.orders) {
        console.log("[OdemePageArea1Component] ", selectedTablePayment.orders);
        this.ordersSubject.next(selectedTablePayment.orders);
      }
    });

    this.paymentService.selectedProductQuantities$.subscribe(selectedProductQuantities => {
      console.log("[OdemePageArea1Component] selectedProductQuantities:", selectedProductQuantities);
      // this.odemePageFacadeService.updateSelectedProductQuantities(selectedProductQuantities);
    });

    this.paymentService.selectedProductQuantities$.subscribe(entries => {
      this.productPaidMap = new Map(entries.map(entry => [entry.productId, entry.totalQuantity]));
    });
  }

  /** Flattened array of all order items from all orders */
  get allItems(): PaymentOrderItem[] {
    return this.ordersSubject.getValue().flatMap(order => order.items);
  }

  get unpaidItems(): PaymentOrderItem[] {
    return this.allItems.filter(item => this.getPaidCount(item) < item.quantity);
  }

  get paidItems(): PaymentOrderItem[] {
    return this.allItems.filter(item => this.getPaidCount(item) >= item.quantity);
  }


  onSelect(item: PaymentOrderItem): void {
    this.odemePageFacadeService.selectItem(item);
  }

  onDeselect(event: MouseEvent, item: PaymentOrderItem): void {
    event.stopPropagation();
    this.odemePageFacadeService.deselectItem(item);
  }

  isSelected(item: PaymentOrderItem): boolean {
    return this.odemePageFacadeService.isSelected(item);
  }

  getSelectedCount(item: PaymentOrderItem): number {
    return this.odemePageFacadeService.getSelectedCount(item);
  }

  isPaid(item: PaymentOrderItem): boolean {
    return this.odemePageFacadeService.isPaid(item);
  }

  getPaidCount(item: PaymentOrderItem): number {
    // return this.odemePageFacadeService.getPaidCount(item);
    return this.productPaidMap.get(item.product.id) || 0;
  }


  get selectedTotal(): number {
    return this.odemePageFacadeService.selectedTotal;
  }

  findProductSubPayments(arg0: string) {
    // return this.odemePageFacadeService.findProductSubPayments(arg0);
    console.log("[OdemePageArea1Component] findProductSubPayments called with arg0:", arg0);
    // return this.paymentService.findProductSubPayments(arg0);
  }
}
