import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart } from '../../../CartFeature/domain/entity/cart';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OrderItem } from '../../../OrderFeature/domain/entities/order-item.entity';
import { ProductOrder } from '../../../OrderFeature/domain/entities/product-order.entity';
import { OrderDto } from '../../../OrderFeature/domain/entities/order.dto';
import { OrderStatus } from '../../../OrderFeature/domain/entities/order-status';
import { UserService } from '../../../services/user.service';
import { UserWithRole } from '../../../UserFeature/domain/entities/user-with-role.entity';
import { OrderService } from '../../../services/order.service';
import { TableService } from '../../../services/table.service';
import { LoggerService } from '../../../services/logger.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

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
    this.logger.log(`[CartAreaComponent] createOrder() clicked with breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);

    this.activeCart?.getItems().forEach(cartItem => {
      this.logger.log(`[CartAreaComponent] Product ID: ${cartItem.product.id} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
    });

    const orderItems: OrderItem[] = this.activeCart
      ? this.activeCart.getItems().map(cartItem => {
        const itemQuantity = cartItem.quantity;
        const urunNotu = cartItem.urunNotu;

        const productOrder = new ProductOrder(
          cartItem.product.id || "",
          cartItem.product.name || "",
          cartItem.product.description || "",
          cartItem.product.price || 0,
          cartItem.product.imageUrl || ""
        );

        const newOrderItem = new OrderItem(productOrder, itemQuantity);
        newOrderItem.urunNotu = urunNotu;
        return newOrderItem;
      })
      : [];

    this.logger.log(`[CartAreaComponent] Final Order Items with breadcrumb=${this.breadcrumbService.getBreadcrumbId()}: ${JSON.stringify(orderItems)}`);

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
        this.logger.log(`[CartAreaComponent] Order created with ID: ${orderId} breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`);
        this.activeCart?.clearCart();
        // optionally reset the cart in the facade:
        // this.tableDetailsPageFacadeService.resetCart();
      },
      error: (err) => {
        this.logger.error(`[CartAreaComponent] Order creation failed with breadcrumb=${this.breadcrumbService.getBreadcrumbId()}`, err);
      }
    });
  }

}

