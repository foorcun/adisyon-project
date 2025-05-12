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

  toggleItemSelection(item: any): void {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1); // remove
    } else {
      this.selectedItems.push(item); // add
    }
    console.log('Selected Items:', this.selectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }
}

