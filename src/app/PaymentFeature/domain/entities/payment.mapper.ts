import { Payment } from './payment.entity';
import { SubPayment } from './sub-payment.entity';
import { PaymentOrder } from './payment-order.entity';
import { PaymentOrderItem } from './payment-order-item.entity';
import { PaymentProduct } from './payment-product.entity';

export class PaymentMapper {
    static toPayment(data: unknown): Payment {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid payment data');
        }

        const raw = data as { [key: string]: any };

        const tableId = raw['tableId'] || '';
        const totalAmount = raw['totalAmount'] || 0;
        const isClosed = raw['isClosed'] || false;
        const createdAt = raw['createdAt'] ? new Date(raw['createdAt']) : new Date();

        // ✅ Map subPayments
        const subPaymentsRaw = raw['subPayments'] || {};
        const subPayments: Record<string, SubPayment> = {};
        for (const [id, sp] of Object.entries(subPaymentsRaw)) {
            subPayments[id] = SubPayment.fromPlainObject(sp);
        }

        // ✅ Map orders
        const ordersRaw = raw['orders'] || [];
        const orders: PaymentOrder[] = Array.isArray(ordersRaw)
            ? ordersRaw.map((orderRaw: any) => {
                const items = Array.isArray(orderRaw.items)
                    ? orderRaw.items.map((itemRaw: any) => {
                        const productRaw = itemRaw['product'] || {};
                        const product = new PaymentProduct(
                            productRaw['id'] || '',
                            productRaw['name'] || '',
                            productRaw['price'] || 0
                        );
                        const item = new PaymentOrderItem(product, itemRaw['quantity'] || 0);
                        item.urunNotu = itemRaw['urunNotu'] || '';
                        return item;
                    })
                    : [];

                return new PaymentOrder(orderRaw['id'] || '', items);
            })
            : [];

        return new Payment(tableId, totalAmount, subPayments, isClosed, createdAt, orders);
    }
}
