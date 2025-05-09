import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatus } from '../../../OrderFeature/domain/entities/order-status';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-odeme-page-area1',
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss'
})
export class OdemePageArea1Component {



  tableId: string | null = null;
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    public odemePageFacadeService: OdemePageFacadeService
  ) {

    this.tableId = this.route.snapshot.paramMap.get('id');
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders.filter(order =>
        order.tableUUID === this.tableId &&
        (order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS)
      );

    });
  }


  getAllItems(): any[] {
    return this.orders.flatMap(order =>
      order.items.flatMap(item => {
        const quantity = Number(item.quantity);

        // Ensure quantity is a positive integer
        if (!Number.isFinite(quantity) || quantity <= 0) {
          return [];
        }

        const unitPrice = item.getTotalPrice / quantity;

        return Array.from({ length: quantity }, () => ({
          product: item.product,
          price: unitPrice
        }));
      })
    );
  }



  toggleItemSelection(index: number): void {
    // const itemPos = this.selectedItems.indexOf(index);
    const itemPos = this.odemePageFacadeService.selectedItems.indexOf(index);
    if (itemPos > -1) {
      // Already selected -> deselect
      this.odemePageFacadeService.selectedItems.splice(itemPos, 1);
    } else {
      // Not selected -> select
      this.odemePageFacadeService.selectedItems.push(index);
    }
    console.log("[OdemePageArea1Component] selected items: " + this.odemePageFacadeService.selectedItems)
  }
}
