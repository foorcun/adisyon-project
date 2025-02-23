import { Order } from "./order.entity";

export class Table {
  id: string;
  name: string;
  capacity: number;
  status: string;
  orders: { [key: string]: Order }; // 🔥 FIXED: Store orders as an object, not an array

  constructor(
    id: string,
    name: string,
    capacity: number,
    status: string,
    orders: { [key: string]: Order } = {} // 🔥 Ensure it's initialized as an object
  ) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.status = status;
    this.orders = orders;
  }
}
