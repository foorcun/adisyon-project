import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-area.component.html',
  styleUrls: ['./cart-area.component.scss']
})
export class CartAreaComponent implements OnInit, OnDestroy {
  activeCart: Cart | null = null;
  private activeCartSubscription!: Subscription;

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService
  ) {}

  ngOnInit(): void {
    this.activeCartSubscription = this.tableDetailsPageFacadeService.activeCart$.subscribe(cart => {
      this.activeCart = cart;
    });
  }

  ngOnDestroy(): void {
    if (this.activeCartSubscription) this.activeCartSubscription.unsubscribe();
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (this.activeCart) {
      if (newQuantity <= 0) {
        this.activeCart.removeItem(productId);
      } else {
        this.activeCart.updateItemQuantity(productId, newQuantity);
      }
    }
  }
}
