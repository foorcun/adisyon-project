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
  ) {}

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
