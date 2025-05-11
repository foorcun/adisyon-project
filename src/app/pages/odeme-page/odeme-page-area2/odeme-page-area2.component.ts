import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { CommonModule } from '@angular/common';
import { OdemeGridComponent } from './odeme-grid/odeme-grid.component';
import { map, Observable } from 'rxjs';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { Payment } from '../../../PaymentFeature/domain/entities/payment.entity';

@Component({
  selector: 'app-odeme-page-area2',
  imports: [CommonModule, OdemeGridComponent],
  templateUrl: './odeme-page-area2.component.html',
  styleUrl: './odeme-page-area2.component.scss'
})
export class OdemePageArea2Component {


  public totalPrice$: Observable<number>;
  public currentPayment$: Observable<Payment>;

  constructor(public odemePageFacadeService: OdemePageFacadeService) {

    console.log("[OdemePageArea2Component] init..")
    this.totalPrice$ = this.odemePageFacadeService.orders$.pipe(
      map(orders => {
        console.log("[OdemePageArea2Component] Received orders:", orders);

        if (!orders || orders.length === 0) {
          console.warn("[OdemePageArea2Component] No orders found.");
          return 0;
        }

        const allItems = orders.flatMap((order, orderIndex) => {
          console.log(`[OdemePageArea2Component] Order[${orderIndex}] items:`, order.items);

          return order.items.map((item, itemIndex) => {
            const reconstructed = new OrderItem(item.product, item.quantity);
            reconstructed.urunNotu = item.urunNotu;
            console.log(`[OdemePageArea2Component] Rehydrated Item[${itemIndex}]`, reconstructed);
            return reconstructed;
          });
        });

        allItems.forEach((item, itemIndex) => {
          const totalPrice = item.getTotalPrice;
          console.log(`[OdemePageArea2Component] Item[${itemIndex}] Total Price: ${totalPrice}`);
        });

        const total = allItems.reduce((sum, item) => sum + item.getTotalPrice, 0);
        console.log("[OdemePageArea2Component] Calculated total price:", total);

        return total;
      })
    );

    this.currentPayment$ = this.odemePageFacadeService.currentPayment$;
  }
}
