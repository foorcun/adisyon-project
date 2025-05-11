import { PaymentMethod } from './payment-method.enum'; // adjust path

export class PaymentCommand {
    constructor(
        public tableId: string,
        public method: PaymentMethod,
        public amount: number
    ) { }
}
