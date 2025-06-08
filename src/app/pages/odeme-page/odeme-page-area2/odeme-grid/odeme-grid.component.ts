import { Component } from '@angular/core';
import { OdemePageFacadeService2 } from '../../../../services/odeme-page-facade2.service';

@Component({
  selector: 'app-odeme-grid',
  imports: [],
  templateUrl: './odeme-grid.component.html',
  styleUrl: './odeme-grid.component.scss'
})
export class OdemeGridComponent {

  constructor(
    private odemePageFacadeService: OdemePageFacadeService2
  ) { }

  handleClick(value: string): void {
    if (value != "-") {
      this.odemePageFacadeService.updatePaymentAmount(value);
    }
  }


}
