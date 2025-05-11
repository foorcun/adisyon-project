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

  constructor(
    public odemePageFacadeService: OdemePageFacadeService
  ) {
  }


  toggleItemSelection(index: number): void {
    // const itemPos = this.selectedItems.indexOf(index);
    const itemPos = this.odemePageFacadeService.selectedItems.indexOf(index);
    if (itemPos > -1) {
      // Already selected -> deselect
      this.odemePageFacadeService.selectedItems.splice(itemPos, 1);
    } else {
      // Not selected -> select
      this.odemePageFacadeService.selectedItems.push(index);
    }
    console.log("[OdemePageArea1Component] selected items: " + this.odemePageFacadeService.selectedItems)
  }
}
