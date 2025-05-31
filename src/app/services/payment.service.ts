import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { PaymentFirebaseRepository } from '../PaymentFeature/infrastructure/payment-firebase-repository';
import { OrderService } from './order.service';
import { PaymentFactory } from '../PaymentFeature/domain/entities/payment-factory';
import { TableService } from './table.service';
import { AdminOrdersPageComponent } from '../pages/admin-orders-page/admin-orders-page.component';
import { AdminOrdersPageFacadeService } from './admin-orders-page-facade.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private paymentsSubject = new BehaviorSubject<Payment[]>([]);
    payments$ = this.paymentsSubject.asObservable();

    constructor(private paymentRepository: PaymentFirebaseRepository, private orderService: OrderService,
        private tableService: TableService,
        private adminOrdersPageFacadeService: AdminOrdersPageFacadeService,
    ) {
        this.listenForPayments(); // 🔁 Start listening for changes immediately
    }

    /** 🔁 Listen for real-time updates to all payments */
    private listenForPayments(): void {
        this.paymentRepository.payments$.subscribe(payments => {
            this.paymentsSubject.next(payments);
        });


        // this.tableService.selectedTable$.subscribe(selectedTable => {
        //     console.log("[PaymentFirebaseRepository] - payment: orderService oncesi yeni selected table", selectedTable)
        // });

        console.log("[PaymentFirebaseRepository] - payment: orderService oncesi ")
        this.orderService.orders$.subscribe(orders => {
            console.log("[PaymentFirebaseRepository] - payment: ", orders)
            this.payments$.subscribe(payments => {
                console.log("[PaymentFirebaseRepository] - payment: payments", payments)
            });
            // const updatedPayments = this.paymentsSubject.getValue().map(payment => {
            //     const relatedOrders = orders.filter(order => {
            //         console.log("[PaymentFirebaseRepository] - payment: orderService", order.tableUUID, payment.tableId)
            //         return order.tableUUID === payment.tableId;
            //     });
            //     console.log("[PaymentFirebaseRepository] - payment: ", relatedOrders)
            //     return PaymentFactory.cloneWithOrders(payment, relatedOrders);
            // });
            // console.log("[PaymentFirebaseRepository] - payment: updatedPayments", updatedPayments)
            // this.paymentsSubject.next(updatedPayments);
        });

    }

    /** 🧾 Get payment for a specific table */
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
    deleteSubPayment(tableId: string, subPaymentKey: string): Observable<void> {
        console.log("[PaymentService]2 deleteSubPayment", tableId, subPaymentKey);
        return this.paymentRepository.deleteSubPayment(tableId, subPaymentKey);
    }

}
