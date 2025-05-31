import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { PaymentFirebaseRepository } from '../PaymentFeature/infrastructure/payment-firebase-repository';
import { OrderService } from './order.service';
import { TableService } from './table.service';
import { PaymentFactory } from '../PaymentFeature/domain/entities/payment-factory';

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
                // console.log("[PaymentService] paymentsMap", paymentsMap)
                // console.log("[PaymentService] selectedTable", selectedTable)
                const payment = selectedTable ? paymentsMap[selectedTable.id] : undefined;
                console.log("[PaymentService] selectedPayment", payment)
                this.orderService.orders$.subscribe((orders) => {
                    console.log('[PaymentService] Orders received:', orders);
                    // this.payments$.subscribe((paymentsMap) => {
                    //     console.log('[PaymentService] Current payments:', paymentsMap);
                    // });
                    const relatedOrders = Object.values(orders).filter(order => order.tableUUID === selectedTable?.id);
                    console.log('[PaymentService] Related orders for selected table:', relatedOrders);

                    // payment!.orders = relatedOrders;
                    payment!.orders = PaymentFactory.convertOrdersToPaymentOrders(relatedOrders); 

                    console.log('[PaymentService] Updated payment with orders:', payment);
                    this.selectedTablePaymentSubject.next(payment);
                });
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
}
