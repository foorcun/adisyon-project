import { Component } from '@angular/core';
import { combineLatest, take, filter } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { PaymentMethod } from '../../../PaymentFeature/domain/entities/payment-method.enum';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { CommonModule } from '@angular/common';
import { OdemePageFacadeService2 } from '../../../services/odeme-page-facade2.service';
import { LoggerService } from '../../../services/logger.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-odeme-page-area3',
  templateUrl: './odeme-page-area3.component.html',
  styleUrl: './odeme-page-area3.component.scss',
  imports: [CommonModule],
})
export class OdemePageArea3Component {

  constructor(
    // public odemePageFacadeService: OdemePageFacadeService,
    public odemePageFacadeService: OdemePageFacadeService2,
    private logger: LoggerService,
    private breadcrumbService: BreadcrumbService
  ) { }

  payNakit(): void {
    // console.log("[OdemePageArea3Component] payNakit() tiklandi")
    this.breadcrumbService.startBreadcrumb();
    this.logger.log("[OdemePageArea3Component] payNakit() tiklandi");

    if (this.odemePageFacadeService.getPaymentAmount() != 0) {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.getPaymentAmount(), PaymentMethod.CASH);
    }
    else {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.selectedTotal, PaymentMethod.CASH);
    }
  }

  payKredikarti(): void {
  this.breadcrumbService.startBreadcrumb();
  this.logger.log("[OdemePageArea3Component] payKredikarti() tiklandi");

    if (this.odemePageFacadeService.getPaymentAmount() != 0) {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.getPaymentAmount(), PaymentMethod.CARD);
    }
    else {
      this.odemePageFacadeService.pay(this.odemePageFacadeService.selectedTotal, PaymentMethod.CARD);
    }
  }

kaydetVeMasayiBosalt(): void {
  this.breadcrumbService.startBreadcrumb();
  this.logger.log("[OdemePageArea3Component] kaydetVeMasayiBosalt() clicked");
  this.odemePageFacadeService.canCloseTable$.pipe(take(1)).subscribe(canClose => {
    if (canClose) {
      this.odemePageFacadeService.closeTableAndSave();
    } else {
      alert("Tüm ürünler ödenmeden masa kapatılamaz.");
    }
  });
}



}
