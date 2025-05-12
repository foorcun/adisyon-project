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
  constructor(public odemePageFacadeService: OdemePageFacadeService) {}

  onSelect(item: any): void {
    this.odemePageFacadeService.selectItem(item);
  }

  onDeselect(event: MouseEvent, item: any): void {
    event.stopPropagation();
    this.odemePageFacadeService.deselectItem(item);
  }

  isSelected(item: any): boolean {
    return this.odemePageFacadeService.isSelected(item);
  }

  isPaid(item: any): boolean {
    return this.odemePageFacadeService.isPaid(item);
  }

  getSelectedCount(item: any): number {
    return this.odemePageFacadeService.getSelectedCount(item);
  }

  get selectedTotal(): number {
    return this.odemePageFacadeService.selectedTotal;
  }
}
