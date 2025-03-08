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
import { UserWithRole } from '../../../UserFeature/domain/entities/user-with-role';
import { OrderService } from '../../../services/order.service';

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
        const urunNotu = cartItem.urunNotu;

        // ✅ Create ProductOrder Object
        const productOrder = new ProductOrder(
          cartItem.product.id || "", // Ensure string
          cartItem.product.name || "",
          cartItem.product.description || "",
          cartItem.product.price || 0,
          cartItem.product.imageUrl || ""
        );

        // ✅ Return OrderItem
        // return new OrderItem(productOrder, itemQuantity);
        const newOrderItem = new OrderItem(productOrder, itemQuantity);
        newOrderItem.urunNotu = urunNotu;
        return newOrderItem;
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

