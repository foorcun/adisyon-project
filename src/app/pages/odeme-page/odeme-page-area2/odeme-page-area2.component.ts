import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { CommonModule } from '@angular/common';
import { OdemeGridComponent } from './odeme-grid/odeme-grid.component';
import { combineLatest, map, Observable } from 'rxjs';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Payment } from '../../../PaymentFeature/domain/entities/payment.entity';
import { SubpaymentComponent } from './subpayment/subpayment.component';

@Component({
  selector: 'app-odeme-page-area2',
  imports: [CommonModule, OdemeGridComponent, SubpaymentComponent],
  templateUrl: './odeme-page-area2.component.html',
  styleUrl: './odeme-page-area2.component.scss'
})
export class OdemePageArea2Component {


  public totalPrice$: Observable<number>;
  public subPaymentTotal$: Observable<number>;

  public remainingAmount$: Observable<number>;

  constructor(public odemePageFacadeService: OdemePageFacadeService) {
    this.totalPrice$ = this.odemePageFacadeService.totalPrice$;
    this.subPaymentTotal$ = this.odemePageFacadeService.subPaymentTotal$;

    this.remainingAmount$ = combineLatest([
      this.totalPrice$,
      this.subPaymentTotal$
    ]).pipe(
      map(([total, paid]) => Math.max(total - paid, 0))
    );
  }
}
