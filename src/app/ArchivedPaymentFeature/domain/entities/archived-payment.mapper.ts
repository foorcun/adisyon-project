import { ArchivedPayment } from './archived-payment.entity';
import { SubPayment } from '../../../PaymentFeature/domain/entities/sub-payment.entity';
import { PaymentOrder } from '../../../PaymentFeature/domain/entities/payment-order.entity';
import { PaymentOrderItem } from '../../../PaymentFeature/domain/entities/payment-order-item.entity';

export class ArchivedPaymentMapper {
    static toArchivedPayment(raw: any): ArchivedPayment {
        const tableId = raw['tableId'] || '';
        const totalAmount = raw['totalAmount'] || 0;
        const isClosed = raw['isClosed'] || false;
        const createdAt = raw['createdAt'] ? new Date(raw['createdAt']) : new Date();
        const closedAt = raw['closedAt'] ? new Date(raw['closedAt']) : new Date();

        const subPaymentsRaw = raw['subPayments'] || {};
        const subPayments: Record<string, SubPayment> = {};
        for (const [id, sp] of Object.entries(subPaymentsRaw)) {
            subPayments[id] = SubPayment.fromPlainObject(sp);
        }

        const ordersRaw = raw['orders'] || [];
        const orders: PaymentOrder[] = Array.isArray(ordersRaw)
            ? ordersRaw.map((orderRaw: any) => {
                const items = Array.isArray(orderRaw.items)
                    ? orderRaw.items.map((itemRaw: any) => {
                        const productRaw = itemRaw['product'] || {};
                        const product = new PaymentOrderItem(
                            {
                                id: productRaw['id'] || '',
                                name: productRaw['name'] || '',
                                price: productRaw['price'] || 0,
                            },
                            itemRaw['quantity'] || 0
                        );
                        product.urunNotu = itemRaw['urunNotu'] || '';
                        return product;
                    })
                    : [];
                return new PaymentOrder(orderRaw['id'] || '', items);
            })
            : [];

        const change = raw['change'] ?? 0; // ✅ Safely fallback to 0 if missing

        return new ArchivedPayment(tableId, totalAmount, subPayments, isClosed, createdAt, closedAt, orders, change);
    }

    static toJson(payment: ArchivedPayment): any {
        return {
            tableId: payment.tableId,
            totalAmount: payment.totalAmount,
            isClosed: payment.isClosed,
            createdAt: payment.createdAt.toISOString(),
            closedAt: payment.closedAt.toISOString(),
            change: payment.change, // ✅ Include the new field
            subPayments: Object.entries(payment.subPayments).reduce((acc, [key, sub]) => {
                acc[key] = sub.toPlainObject();
                return acc;
            }, {} as Record<string, any>),
            orders: payment.orders.map(order => ({
                id: order.id,
                items: order.items.map(item => ({
                    urunNotu: item.urunNotu,
                    quantity: item.quantity,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                    }
                }))
            }))
        };
    }
}
