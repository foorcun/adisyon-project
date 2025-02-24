import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status';

export class Order {
  constructor(
    public id: string,
    public items: OrderItem[],
    public tableName: string,
    public status: OrderStatus,
    public createdAt: Date,
    public updatedAt: Date,
    public totalAmount: number,
    public userUid: string // Added user's UID
  ) { }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

}
