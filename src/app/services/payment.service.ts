import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Payment } from '../PaymentFeature/domain/entities/payment.entity';
import { PaymentCommand } from '../PaymentFeature/domain/entities/payment-command';
import { PaymentRepository } from '../PaymentFeature/domain/repositories/payment-repository';
import { PaymentFirebaseRepository } from '../PaymentFeature/infrastructure/payment-firebase-repository';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private paymentsSubject = new BehaviorSubject<Payment[]>([]);
    payments$ = this.paymentsSubject.asObservable();

    constructor(private paymentRepository: PaymentFirebaseRepository) {
        this.listenForPayments(); // 🔁 Start listening for changes immediately
    }

    /** 🔁 Listen for real-time updates to all payments */
    private listenForPayments(): void {
        this.paymentRepository.payments$.subscribe(payments => {
            this.paymentsSubject.next(payments);
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
}
