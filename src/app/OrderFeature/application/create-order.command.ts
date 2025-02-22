import { Order } from "../domain/entities/order.entity";

export class CreateOrderCommand {
  constructor(
    public userKey: string, // The unique identifier for the user
    public order: Order // The order details
  ) {}
}
