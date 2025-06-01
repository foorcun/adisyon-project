import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { PaymentFirebaseRepository } from '../PaymentFeature/infrastructure/payment-firebase-repository';
import { OrderService } from './order.service';
import { TableService } from './table.service';
import { PaymentFactory } from '../PaymentFeature/domain/entities/payment-factory';
import { SubPayment } from '../PaymentFeature/domain/entities/sub-payment.entity';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private paymentsSubject = new BehaviorSubject<{ [key: string]: Payment }>({});
    payments$ = this.paymentsSubject.asObservable();

    private selectedTablePaymentSubject = new BehaviorSubject<Payment | undefined>(undefined);
    selectedTablePayment$ = this.selectedTablePaymentSubject.asObservable();


    constructor(
        private paymentRepository: PaymentFirebaseRepository,
        private orderService: OrderService,
        private tableService: TableService
    ) {
        this.listenForPayments();

    }

    /** 🔁 Listen to payment updates from the repository */
    private listenForPayments(): void {
        this.paymentRepository.payments$.subscribe((paymentsMap) => {
            // console.log('[PaymentService] Payments received:', paymentsMap);
            this.paymentsSubject.next(paymentsMap);

            // 🧠 Listen to selectedTable changes and update selectedTablePayment
            this.tableService.selectedTable$.subscribe(selectedTable => {
                const paymentsMap = this.paymentsSubject.getValue();
                const payment = selectedTable ? paymentsMap[selectedTable.id] : undefined;
                console.log("[PaymentService] selectedPayment", payment)
                this.orderService.orders$.subscribe((orders) => {
                    // console.log('[PaymentService] Orders received:', orders);
                    const relatedOrders = Object.values(orders).filter(order => order.tableUUID === selectedTable?.id);
                    // console.log('[PaymentService] Related orders for selected table:', relatedOrders);

                    payment!.orders = PaymentFactory.convertOrdersToPaymentOrders(relatedOrders);

                    // console.log('[PaymentService] Updated payment with -ORaTydw_dw8bdkDRv-R:', this.findProductSubPaymentsForSelectedProduct('-ORaTydw_dw8bdkDRv-R'));
                    // console.log('[PaymentService] Updated payment with -ORaTydw_dw8bdkDRv-R:', this.findProductSubPayments('-ORaTydw_dw8bdkDRv-R'));

                    this.selectedTablePaymentSubject.next(payment);
                });
            });
        });


        this.selectedTablePayment$.subscribe((payment) => {
            // console.log('[PaymentService] Selected table payment updated:', payment);
            this.findProductSubPayments('-ORaTydw_dw8bdkDRv-R').subscribe(result => {
                console.log('[PaymentService] SubPayments for product:', result);
            });
        });



    }

    /** 🧾 Return sorted payments map */
    getPayments(): { [key: string]: Payment } {
        const payments = this.paymentsSubject.getValue();
        const sorted = Object.entries(payments)
            .sort(([, a], [, b]) => a.tableId.localeCompare(b.tableId, undefined, { numeric: true }))
            .reduce((acc, [key, payment]) => {
                acc[key] = payment;
                return acc;
            }, {} as { [key: string]: Payment });

        return sorted;
    }

    /** 🧾 Synchronous lookup for a specific payment */
    getPaymentByTableIdSync(tableId: string): Payment | undefined {
        return this.paymentsSubject.getValue()[tableId];
    }

    /** 🧾 Get payment for a specific table as observable */
    getPaymentByTableId(tableId: string): Observable<Payment> {
        return this.paymentRepository.getPaymentByTableId(tableId);
    }

    /** 💸 Initialize a new payment for a table */
    initializePayment(tableId: string, totalAmount: number): Observable<void> {
        return this.paymentRepository.initializePayment(tableId, totalAmount);
    }

    /** ➕ Add a sub-payment */
    addSubPayment(command: PaymentCommand): Observable<void> {
        return this.paymentRepository.addSubPayment(command);
    }

    /** ✅ Finalize (close) payment */
    closePayment(tableId: string): Observable<void> {
        return this.paymentRepository.closePayment(tableId);
    }

    /** ❌ Remove a sub-payment */
    deleteSubPayment(tableId: string, subPaymentKey: string): Observable<void> {
        console.log('[PaymentService] deleteSubPayment', tableId, subPaymentKey);
        return this.paymentRepository.deleteSubPayment(tableId, subPaymentKey);
    }


    findProductSubPayments(productId: string): Observable<{
        matchedSubPayments: SubPayment[];
        totalPaidQuantity: number;
    }> {
        console.log("[PaymentService] start")
        return this.selectedTablePayment$.pipe(
            tap(payment => console.log("[PaymentService] payment received", payment)),

            filter((payment): payment is Payment => {
                console.log("[PaymentService] inside filter", payment);

                return !!payment && !!payment.subPayments;
            }),
            map(payment => {

                console.log("[PaymentService] 3")
                let totalPaidQuantity = 0;
                const matchedSubPayments: SubPayment[] = [];

                for (const sub of Object.values(payment.subPayments)) {
                    if (!sub?.subPaymentItems) continue;

                    const match = sub.subPaymentItems.find(item => item.productId === productId);
                    if (match) {
                        totalPaidQuantity += match.quantity;
                        matchedSubPayments.push(sub);
                    }
                }
                console.log("[PaymentService] matchedSubPayments", matchedSubPayments)
                console.log("[PaymentService] matchedSubPayments", matchedSubPayments[0].subPaymentItems[0].quantity)
                return {
                    matchedSubPayments,
                    totalPaidQuantity
                };
            })
        );
    }


}
