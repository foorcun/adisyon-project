import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../../../PaymentFeature/domain/entities/payment.entity';
import { OdemePageFacadeService } from '../../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-subpayment',
  imports: [CommonModule],
  templateUrl: './subpayment.component.html',
  styleUrl: './subpayment.component.scss'
})
export class SubpaymentComponent {

  public currentPayment$: Observable<Payment>;

  constructor(public odemePageFacadeService: OdemePageFacadeService) {

    this.currentPayment$ = this.odemePageFacadeService.currentPayment$;
  }
}
