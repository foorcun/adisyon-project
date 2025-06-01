import { Observable } from 'rxjs';
import { ArchivedPayment } from '../entities/archived-payment.entity';

/**
 * Abstract repository for managing archived payments.
 * Defines contract for saving, retrieving, and deleting archived payments.
 */
export abstract class ArchivedPaymentRepository {
    /**
     * Archives a completed payment (moves from active to archived).
     * @param payment The payment to archive.
     * @returns An Observable that completes when the operation finishes.
     */
    abstract archivePayment(payment: ArchivedPayment): Observable<void>;

    /**
     * Retrieves all archived payments.
     * @returns An Observable that emits an array of archived payments.
     */
    abstract getArchivedPayments(): Observable<ArchivedPayment[]>;

    /**
     * Retrieves a specific archived payment by table ID.
     * @param tableId The ID of the table.
     * @returns An Observable that emits the archived payment or undefined if not found.
     */
    abstract getArchivedPaymentByTableId(tableId: string): Observable<ArchivedPayment | undefined>;

    /**
     * Deletes a specific archived payment.
     * @param tableId The ID of the table to delete from the archive.
     * @returns An Observable that completes when the deletion is done.
     */
    abstract deleteArchivedPayment(tableId: string): Observable<void>;
}
