import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';

@Component({
  selector: 'app-odeme-page-area1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss',
})
export class OdemePageArea1Component {
  private orders: Order[] = [];

  constructor(public odemePageFacadeService: OdemePageFacadeService) {
    this.odemePageFacadeService.orders$.pipe(take(1)).subscribe(orders => {
      this.orders = orders;
    });
  }

  get allItems(): OrderItem[] {
    return this.orders.flatMap(order => order.items);
  }

  get unpaidItems(): OrderItem[] {
    return this.allItems.filter(item => this.getPaidCount(item) < item.quantity);
  }

  get paidItems(): OrderItem[] {
    return this.allItems.filter(item => this.getPaidCount(item) >= item.quantity);
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

  getSelectedCount(item: OrderItem): number {
    return this.odemePageFacadeService.getSelectedCount(item);
  }

  isPaid(item: OrderItem): boolean {
    return this.odemePageFacadeService.isPaid(item);
  }

  getPaidCount(item: OrderItem): number {
    return this.odemePageFacadeService.getPaidCount(item);
  }

  get selectedTotal(): number {
    return this.odemePageFacadeService.selectedTotal;
  }
}
