import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArchivedPayment } from '../ArchivedPaymentFeature/domain/entities/archived-payment.entity';
import { ArchivedPaymentFirebaseRepository } from '../ArchivedPaymentFeature/infrastructure/archived-payment-firebase-repository';

/**
 * Service layer for ArchivedPaymentFeature.
 * Manages state and operations related to archived payments.
 */
@Injectable({
    providedIn: 'root',
})
export class ArchivedPaymentService {
    private archivedPaymentsSubject = new BehaviorSubject<{ [key: string]: ArchivedPayment }>({});
    archivedPayments$ = this.archivedPaymentsSubject.asObservable();

    constructor(private archivedPaymentRepository: ArchivedPaymentFirebaseRepository) {
        this.listenForArchivedPayments();
    }

    /**
     * Subscribes to archived payments from the repository
     * and updates local BehaviorSubject.
     */
    private listenForArchivedPayments(): void {
        this.archivedPaymentRepository.getArchivedPayments().subscribe((archivedPaymentsArray) => {
            const map: { [key: string]: ArchivedPayment } = {};
            for (const archived of archivedPaymentsArray) {
                map[archived.tableId] = archived;
            }
            this.archivedPaymentsSubject.next(map);
            console.log('[ArchivedPaymentService] Archived Payments received:', map);
        });
    }

    /**
     * Synchronous access to archived payments as a dictionary.
     */
    getArchivedPayments(): { [key: string]: ArchivedPayment } {
        return this.archivedPaymentsSubject.getValue();
    }

    /**
     * Synchronously get a specific archived payment by table ID.
     */
    getArchivedPaymentByIdSync(tableId: string): ArchivedPayment | undefined {
        return this.archivedPaymentsSubject.getValue()[tableId];
    }

    /**
     * Asynchronously get a specific archived payment by table ID.
     */
    getArchivedPaymentById(tableId: string): Observable<ArchivedPayment | undefined> {
        return this.archivedPaymentRepository.getArchivedPaymentByTableId(tableId);
    }

    /**
     * Adds a new archived payment (called when payment is completed).
     */
    addArchivedPayment(payment: ArchivedPayment): Observable<void> {
        return this.archivedPaymentRepository.archivePayment(payment);
    }

    /**
     * Deletes an archived payment by table ID.
     */
    deleteArchivedPayment(tableId: string): Observable<void> {
        return this.archivedPaymentRepository.deleteArchivedPayment(tableId);
    }
}
