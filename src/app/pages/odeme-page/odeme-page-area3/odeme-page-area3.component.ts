import { Component } from '@angular/core';
import { combineLatest, take, filter } from 'rxjs';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { PaymentMethod } from '../../../PaymentFeature/domain/entities/payment-method.enum';

@Component({
  selector: 'app-odeme-page-area3',
  templateUrl: './odeme-page-area3.component.html',
  styleUrl: './odeme-page-area3.component.scss'
})
export class OdemePageArea3Component {

  constructor(
    private odemePageFacadeService: OdemePageFacadeService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
  ) {}

  payNakit(): void {
    console.log("[OdemePageArea3Component] payNakit() tiklandi")
    // this.odemePageFacadeService.payWithCurrentAmount(PaymentMethod.CASH);
    this.
  }

  payKredikarti(): void {
    console.log("[OdemePageArea3Component] payNakit() tiklandi")
    this.odemePageFacadeService.payWithCurrentAmount(PaymentMethod.CARD);
  }
}
