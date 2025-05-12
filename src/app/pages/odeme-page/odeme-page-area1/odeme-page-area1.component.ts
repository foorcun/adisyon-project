import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';
import { take } from 'rxjs';

@Component({
  selector: 'app-odeme-page-area1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss',
})
export class OdemePageArea1Component {
  private allItemsCache: OrderItem[] = [];

  constructor(public odemePageFacadeService: OdemePageFacadeService) {
    this.odemePageFacadeService.orders$.pipe(take(1)).subscribe(orders => {
      this.allItemsCache = orders.flatMap(order => order.items);
    });
  }

  // 🔵 Unpaid items
  get unpaidItems(): OrderItem[] {
    return this.allItemsCache.filter(item => !this.isPaid(item));
  }

  // ✅ Paid items
  get paidItems(): OrderItem[] {
    return this.allItemsCache.filter(item => this.isPaid(item));
  }

  // ✅ Selection and payment state passthroughs
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
