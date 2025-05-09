import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-odeme-grid',
  imports: [],
  templateUrl: './odeme-grid.component.html',
  styleUrl: './odeme-grid.component.scss'
})
export class OdemeGridComponent {

  constructor(
    private odemePageFacadeService: OdemePageFacadeService
  ) { }

  handleClick(value: string): void {
    this.odemePageFacadeService.updatePaymentAmount(value);
  }


}
