import { PaymentOrderItem } from "./payment-order-item.entity";
import { Payment } from './payment.entity';

export class PaymentOrder {
  constructor(
    public id: string,
    public items: PaymentOrderItem[],
    // public tableUUID: string,
    // public status: OrderStatus,
    // public createdAt: Date,
    // public updatedAt: Date,
    // public totalAmount: number,
    // public userUid: string // Added user's UID
  ) { }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

}
