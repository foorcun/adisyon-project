import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Payment } from '../../../../PaymentFeature/domain/entities/payment.entity';
import { SubPayment } from '../../../../PaymentFeature/domain/entities/sub-payment.entity';
import { OdemePageFacadeService } from '../../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-subpayment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subpayment.component.html',
  styleUrl: './subpayment.component.scss'
})
export class SubpaymentComponent {
  public currentPayment$: Observable<Payment>;

  public subPaymentEntries$: Observable<[string, SubPayment][]>;

  constructor(public odemePageFacadeService: OdemePageFacadeService) {
    this.currentPayment$ = this.odemePageFacadeService.currentPayment$;

    this.subPaymentEntries$ = this.currentPayment$.pipe(
      map((payment: Payment) => {
        const raw = payment.subPayments as Record<string, SubPayment>;
        return Object.entries(raw || {});
      })
    );
  }

  objectKeys = Object.keys;

  /**
   * Delete subpayment by its Firebase key
   */
  deleteSubPayment(key: string): void {
    // this.odemePageFacadeService.deleteSubPaymentByKey(key);
    console.log("[SubpaymentComponent] Deleting subpayment with key:", key);
    this.odemePageFacadeService.deleteSubPaymentAtIndex(key)
  }


}
