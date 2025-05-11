import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { OdemeGridComponent } from './odeme-grid/odeme-grid.component';
import { SubpaymentComponent } from './subpayment/subpayment.component';

@Component({
  selector: 'app-odeme-page-area2',
  standalone: true,
  imports: [CommonModule, OdemeGridComponent, SubpaymentComponent],
  templateUrl: './odeme-page-area2.component.html',
  styleUrl: './odeme-page-area2.component.scss'
})
export class OdemePageArea2Component {

  public totalPrice$: Observable<number>;
  public subPaymentTotal$: Observable<number>;
  public remainingInfo$: Observable<{ label: string; amount: number }>;

  constructor(public odemePageFacadeService: OdemePageFacadeService) {
    this.totalPrice$ = this.odemePageFacadeService.totalPrice$;
    this.subPaymentTotal$ = this.odemePageFacadeService.subPaymentTotal$;

    this.remainingInfo$ = combineLatest([
      this.totalPrice$,
      this.subPaymentTotal$
    ]).pipe(
      map(([total, paid]) => {
        const diff = paid - total;

        if (diff < 0) {
          return { label: 'Kalan Tutar', amount: Math.abs(diff) };
        } else if (diff > 0) {
          return { label: 'Para Üstü', amount: diff };
        } else {
          return { label: 'Tam Ödendi', amount: 0 };
        }
      })
    );
  }
}
