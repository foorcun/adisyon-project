import { PaymentMethod } from './payment-method.enum';
import { SubPaymentItem } from './sub-payment-item.interface';

export class PaymentCommand {
  constructor(
    public tableId: string,
    public method: PaymentMethod,
    public amount: number,
    public items: SubPaymentItem[] = [] // ✅ NEW
  ) {}
}
