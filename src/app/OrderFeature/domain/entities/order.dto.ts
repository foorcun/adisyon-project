import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "./order-status";

export interface OrderDto {
  id: string;
  items: OrderItem[];
  tableName: string;
  status: OrderStatus;
  createdAt: string; // ISO String format for Firestore
  updatedAt: string;
  totalAmount: number;
  userUid: string;
}
