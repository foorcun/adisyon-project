import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-odeme-page-area1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss',
})
export class OdemePageArea1Component {
  // Tracks item: quantity selected
  selectedCountMap = new Map<any, number>();

  constructor(public odemePageFacadeService: OdemePageFacadeService) {}

  selectItem(item: any, order: any): void {
    const selectedCount = this.selectedCountMap.get(item) ?? 0;

    if (selectedCount < item.quantity) {
      this.selectedCountMap.set(item, selectedCount + 1);
    } else {
      console.log('Already selected max quantity of this item.');
    }
  }

  deselectItem(item: any): void {
    const selectedCount = this.selectedCountMap.get(item) ?? 0;

    if (selectedCount > 1) {
      this.selectedCountMap.set(item, selectedCount - 1);
    } else {
      this.selectedCountMap.delete(item);
    }
  }

  onDeselectClick(event: MouseEvent, item: any): void {
    event.stopPropagation();
    this.deselectItem(item);
  }

  isSelected(item: any): boolean {
    return this.selectedCountMap.has(item);
  }

  getSelectedCount(item: any): number {
    return this.selectedCountMap.get(item) ?? 0;
  }

  get selectedTotal(): number {
    let total = 0;
    this.selectedCountMap.forEach((count, item) => {
      const unitPrice = item.product?.price ?? 0;
      total += unitPrice * count;
    });
    return total;
  }
}
