import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-odeme-page-area1',
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss'
})
export class OdemePageArea1Component {
  selectedItems: any[] = [];

  constructor(public odemePageFacadeService: OdemePageFacadeService) { }

  selectItem(item: any): void {
    if (!this.isSelected(item)) {
      this.selectedItems.push(item);
    }
  }

  deselectItem(item: any): void {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  get selectedTotal(): number {
    return this.selectedItems.reduce((total, item) => {
      const itemTotal = item.product?.price * item.quantity;
      return total + (itemTotal || 0);
    }, 0);
  }
}

