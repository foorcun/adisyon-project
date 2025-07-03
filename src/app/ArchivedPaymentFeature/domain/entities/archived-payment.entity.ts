import { PaymentOrder } from "../../../PaymentFeature/domain/entities/payment-order.entity";
import { SubPayment } from "../../../PaymentFeature/domain/entities/sub-payment.entity";

export class ArchivedPayment {
  constructor(
    public readonly tableId: string,
    public readonly totalAmount: number,
    public readonly subPayments: Record<string, SubPayment>,
    public readonly isClosed: boolean,
    public readonly createdAt: Date,
    public readonly closedAt: Date,
    public readonly orders: PaymentOrder[],
    public change: number = 0
  ) {}
}
