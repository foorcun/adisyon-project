import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Cart } from '../../../../CartFeature/domain/entity/cart';
import { Subscription } from 'rxjs';
import { UserWithRole } from '../../../../UserFeature/domain/entities/user-with-role';
import { TableDetailsPageFacadeService } from '../../../../services/table-details-page.facade.service';
import { OrderService } from '../../../../services/order.service';
import { UserService } from '../../../../services/user.service';
import { OrderItem } from '../../../../OrderFeature/domain/entities/order-item.entity';
import { ProductOrder } from '../../../../OrderFeature/domain/entities/product-order.entity';
import { OrderDto } from '../../../../OrderFeature/domain/entities/order.dto';
import { OrderStatus } from '../../../../OrderFeature/domain/entities/order-status';

@Component({
  selector: 'app-cart-area-mobile',
  imports: [CommonModule],
  templateUrl: './cart-area-mobile.component.html',
  styleUrl: './cart-area-mobile.component.scss'
})
export class CartAreaMobileComponent {
  activeCart: Cart | null = null;
  private activeCartSubscription!: Subscription;


  currentUserWithRole: UserWithRole | null = null;

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
    private orderService: OrderService,
    private userService: UserService
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
    console.log('[CartAreaComponent] Creating order...');

    this.activeCart?.getItems().forEach(cartItem => {
      console.log(`[CartAreaComponent] Product ID: ${cartItem.product.id}`);
    });

    // ✅ Properly Map Cart Items to Order Items
    const orderItems: OrderItem[] = this.activeCart
      ? this.activeCart.getItems().map(cartItem => {
        const itemQuantity = cartItem.quantity;

        // ✅ Create ProductOrder Object
        const productOrder = new ProductOrder(
          cartItem.product.id || "", // Ensure string
          cartItem.product.name || "",
          cartItem.product.description || "",
          cartItem.product.price || 0,
          cartItem.product.imageUrl || ""
        );

        // ✅ Return OrderItem
        return new OrderItem(productOrder, itemQuantity);
      })
      : [];

    console.log("[CartAreaComponent] Final Order Items:", orderItems);

    // Convert Order to Firestore-compatible DTO
    const orderDto: OrderDto = {
      id: '',
      items: orderItems,
      tableUUID: this.tableDetailsPageFacadeService.getTable()?.id || '',
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: 0,
      userUid: this.currentUserWithRole!.firebaseUser.uid,
    };
    // ✅ Reset Cart
    // this.tableDetailsPageFacadeService.resetCart();
    // ✅ Create Order
    // this.tableDetailsPageFacadeService.createOrder(orderDto);
    this.orderService.createOrder(orderDto).subscribe({
      next: (orderId) => {
        console.log(`[CartAreaComponent] Order created with ID: ${orderId}`);
        // this.tableDetailsPageFacadeService.resetCart();
        this.activeCart?.clearCart();
      }
    });
  }

}
