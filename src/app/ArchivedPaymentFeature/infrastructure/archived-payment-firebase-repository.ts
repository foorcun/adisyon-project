import { Injectable } from '@angular/core';
import {
    Database,
    ref,
    set,
    get,
    remove,
    DataSnapshot
} from '@angular/fire/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArchivedPaymentRepository } from '../domain/repositories/archived-payment-repository';
import { ArchivedPayment } from '../domain/entities/archived-payment.entity';
import { ArchivedPaymentMapper } from '../domain/entities/archived-payment.mapper';

@Injectable({
    providedIn: 'root',
})
export class ArchivedPaymentFirebaseRepository extends ArchivedPaymentRepository {
    private basePath = 'archivedPayments';
    private menuKey = 'menuKey_zeuspub';

    private archivedPaymentsSubject = new BehaviorSubject<{ [key: string]: ArchivedPayment }>({});
    archivedPayments$ = this.archivedPaymentsSubject.asObservable();

    constructor(private database: Database) {
        super();
        this.listenForArchivedPayments();
    }

    private listenForArchivedPayments(): void {
        const paymentsRef = ref(this.database, `${this.basePath}/${this.menuKey}`);
        get(paymentsRef)
            .then((snapshot: DataSnapshot) => {
                const data = snapshot.val();
                if (data) {
                    const archivedMap: { [key: string]: ArchivedPayment } = {};
                    for (const [tableId, raw] of Object.entries(data)) {
                        archivedMap[tableId] = ArchivedPaymentMapper.toArchivedPayment(raw);
                    }
                    this.archivedPaymentsSubject.next(archivedMap);
                } else {
                    this.archivedPaymentsSubject.next({});
                }
            })
            .catch(error => {
                console.error('[ArchivedPaymentRepository] Error loading archived payments:', error);
                this.archivedPaymentsSubject.next({});
            });
    }

    override archivePayment(payment: ArchivedPayment): Observable<void> {
        const path = `${this.basePath}/${this.menuKey}/${payment.tableId}`;
        return new Observable(observer => {
            set(ref(this.database, path), ArchivedPaymentMapper.toJson(payment))
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[ArchivedPaymentRepository] Archived payment for table ${payment.tableId}`);
                })
                .catch(error => observer.error(error));
        });
    }

    override getArchivedPayments(): Observable<ArchivedPayment[]> {
        const archiveRef = ref(this.database, `${this.basePath}/${this.menuKey}`);
        return new Observable(observer => {
            get(archiveRef)
                .then((snapshot: DataSnapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const payments: ArchivedPayment[] = Object.values(data).map((raw: any) =>
                            ArchivedPaymentMapper.toArchivedPayment(raw)
                        );
                        observer.next(payments);
                    } else {
                        observer.next([]);
                    }
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }

    override getArchivedPaymentByTableId(tableId: string): Observable<ArchivedPayment | undefined> {
        const path = `${this.basePath}/${this.menuKey}/${tableId}`;
        return new Observable(observer => {
            get(ref(this.database, path))
                .then((snapshot: DataSnapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        observer.next(ArchivedPaymentMapper.toArchivedPayment(data));
                    } else {
                        observer.next(undefined);
                    }
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }

    override deleteArchivedPayment(tableId: string): Observable<void> {
        const path = `${this.basePath}/${this.menuKey}/${tableId}`;
        return new Observable(observer => {
            remove(ref(this.database, path))
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[ArchivedPaymentRepository] Deleted archived payment for table ${tableId}`);
                })
                .catch(error => observer.error(error));
        });
    }
}
