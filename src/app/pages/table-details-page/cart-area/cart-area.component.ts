import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-area',
  imports: [CommonModule],
  templateUrl: './cart-area.component.html',
  styleUrl: './cart-area.component.scss'
})
export class CartAreaComponent implements OnInit, OnDestroy {
  activeCart: Cart | null = null;

  private activeCartSubscription!: Subscription;

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService
  ) { }

  ngOnInit(): void {
    this.activeCartSubscription = this.tableDetailsPageFacadeService.activeCart$.subscribe(cart => {
      this.activeCart = cart;
    });
  }


  ngOnDestroy(): void {
    if(this.activeCartSubscription) this.activeCartSubscription.unsubscribe();
  }
}

