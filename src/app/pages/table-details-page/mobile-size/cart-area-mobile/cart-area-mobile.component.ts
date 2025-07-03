import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart } from '../../../../CartFeature/domain/entity/cart';
import { Subscription } from 'rxjs';
import { UserWithRole } from '../../../../UserFeature/domain/entities/user-with-role.entity';
import { TableDetailsPageFacadeService } from '../../../../services/table-details-page.facade.service';
import { OrderService } from '../../../../services/order.service';
import { UserService } from '../../../../services/user.service';
import { OrderItem } from '../../../../OrderFeature/domain/entities/order-item.entity';
import { ProductOrder } from '../../../../OrderFeature/domain/entities/product-order.entity';
import { OrderDto } from '../../../../OrderFeature/domain/entities/order.dto';
import { OrderStatus } from '../../../../OrderFeature/domain/entities/order-status';
import { TableService } from '../../../../services/table.service';
import { LoggerService } from '../../../../services/logger.service';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';

@Component({
  selector: 'app-cart-area-mobile',
  imports: [CommonModule],
  templateUrl: './cart-area-mobile.component.html',
  styleUrl: './cart-area-mobile.component.scss'
})
export class CartAreaMobileComponent implements OnInit, OnDestroy {
  activeCart: Cart | null = null;
  private activeCartSubscription!: Subscription;

  currentUserWithRole: UserWithRole | null = null;

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private tableService: TableService,
    private orderService: OrderService,
    private userService: UserService,
    private logger: LoggerService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.activeCartSubscription = this.tableDetailsPageFacadeService.activeCart$.subscribe(cart => {
      this.activeCart = cart;
    });

    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
    });
  }

  ngOnDestroy(): void {
    if (this.activeCartSubscription) this.activeCartSubscription.unsubscribe();
    this.activeCart?.clearCart();
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

  createOrder(): void {
    this.breadcrumbService.startBreadcrumb();
    this.logger.log(`[CartAreaMobileComponent] createOrder() clicked`);

    this.activeCart?.getItems().forEach(cartItem => {
      this.logger.log(`[CartAreaMobileComponent] Product ID: ${cartItem.product.id}`);
    });

    const orderItems: OrderItem[] = this.activeCart
      ? this.activeCart.getItems().map(cartItem => {
          const productOrder = new ProductOrder(
            cartItem.product.id || "",
            cartItem.product.name || "",
            cartItem.product.description || "",
            cartItem.product.price || 0,
            cartItem.product.imageUrl || ""
          );
          return new OrderItem(productOrder, cartItem.quantity);
        })
      : [];

    this.logger.log(`[CartAreaMobileComponent] Final Order Items: ${JSON.stringify(orderItems)}`);

    const orderDto: OrderDto = {
      id: '',
      items: orderItems,
      tableUUID: this.tableService.getSelectedTable()?.id || '',
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: 0,
      userUid: this.currentUserWithRole!.firebaseUser.uid,
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: (orderId) => {
        this.activeCart?.clearCart();
        this.tableDetailsPageFacadeService.goBack();
        this.logger.log(`[CartAreaMobileComponent] Order created with ID: ${orderId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
      },
      error: (err) => {
        this.logger.error(`[CartAreaMobileComponent] Order creation failed with breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`, err);
      }
    });
  }
}
