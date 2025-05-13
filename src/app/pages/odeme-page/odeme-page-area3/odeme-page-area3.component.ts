import { Component } from '@angular/core';
import { combineLatest, take, filter } from 'rxjs';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { PaymentMethod } from '../../../PaymentFeature/domain/entities/payment-method.enum';
import { Cart } from '../../../CartFeature/domain/entity/cart';

@Component({
  selector: 'app-odeme-page-area3',
  templateUrl: './odeme-page-area3.component.html',
  styleUrl: './odeme-page-area3.component.scss'
})
export class OdemePageArea3Component {

  constructor(
    public odemePageFacadeService: OdemePageFacadeService,
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
  ) { }

  payNakit(): void {
    console.log("[OdemePageArea3Component] payNakit() tiklandi")
    if (this.odemePageFacadeService.getPaymentAmount() != 0) {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.getPaymentAmount(), PaymentMethod.CASH);
    }
    else {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.selectedTotal, PaymentMethod.CASH);
    }
  }

  payKredikarti(): void {
    console.log("[OdemePageArea3Component] payKredikarti() tiklandi")

    if (this.odemePageFacadeService.getPaymentAmount() != 0) {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.getPaymentAmount(), PaymentMethod.CARD);
    }
    else {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.selectedTotal, PaymentMethod.CARD);
    }
  }

  kaydetVeMasayiBosalt(): void {
    if (this.odemePageFacadeService.canCloseTable()) {
      this.odemePageFacadeService.closeTableAndSave();
    } else {
      alert("Tüm ürünler ödenmeden masa kapatılamaz.");
    }
  }

}
