import { Injectable } from '@angular/core';
import {
    Database,
    ref,
    push,
    set,
    update,
    onValue,
    DataSnapshot,
    remove
} from '@angular/fire/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaymentRepository } from '../domain/repositories/payment-repository';
import { Payment } from '../domain/entities/payment.entity';
import { PaymentCommand } from '../domain/entities/payment-command';
import { SubPayment } from '../domain/entities/sub-payment.entity';
import { PaymentMapper } from '../domain/entities/payment.mapper';

@Injectable({
    providedIn: 'root',
})
export class PaymentFirebaseRepository extends PaymentRepository {
    private basePath = 'payments';

    private paymentsSubject = new BehaviorSubject<{ [tableId: string]: Payment }>({});
    payments$ = this.paymentsSubject.asObservable();

    menuKey = 'menuKey_zeuspub';

    constructor(private database: Database) {
        super();
        this.listenForPayments();
    }

    private listenForPayments(): void {
        const paymentsRef = ref(this.database, `${this.basePath}/${this.menuKey}`);
        onValue(
            paymentsRef,
            (snapshot: DataSnapshot) => {
                const data = snapshot.val();
                if (data) {
                    const paymentsMap: { [tableId: string]: Payment } = {};

                    for (const [tableId, raw] of Object.entries(data)) {
                        paymentsMap[tableId] = PaymentMapper.toPayment(raw);
                    }

                    console.log("[PaymentFirebaseRepository] - payments:", paymentsMap);
                    this.paymentsSubject.next(paymentsMap);
                } else {
                    this.paymentsSubject.next({});
                }
            },
            (error) => {
                console.error('[PaymentFirebaseRepository] - Error listening to payments:', error.message);
            }
        );
    }

    override initializePayment(tableId: string, totalAmount: number): Observable<void> {
        const paymentRef = ref(this.database, `${this.basePath}/${this.menuKey}/${tableId}`);
        const payment = {
            tableId,
            totalAmount,
            subPayments: {},
            isClosed: false,
            createdAt: new Date().toISOString(),
        };

        return new Observable((observer) => {
            set(paymentRef, payment)
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[PaymentFirebaseRepository] - Payment initialized for table ${tableId}`);
                })
                .catch((error) => observer.error(error));
        });
    }

    override addSubPayment(command: PaymentCommand): Observable<void> {
        const subPayment = new SubPayment(command.method, command.amount, new Date(), command.items);
        const paymentRef = ref(this.database, `${this.basePath}/${this.menuKey}/${command.tableId}/subPayments`);

        return new Observable((observer) => {
            push(paymentRef, subPayment.toPlainObject())
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[PaymentFirebaseRepository] - SubPayment added:`, subPayment);
                })
                .catch((error) => observer.error(error));
        });
    }

    override getPaymentByTableId(tableId: string): Observable<Payment> {
        const refPath = ref(this.database, `${this.basePath}/${this.menuKey}/${tableId}`);
        return new Observable((observer) => {
            onValue(
                refPath,
                (snapshot: DataSnapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const payment = PaymentMapper.toPayment(data);
                        observer.next(payment);
                    } else {
                        console.warn(`[PaymentFirebaseRepository] No payment found for table ${tableId}, returning empty Payment.`);
                        const fallback = new Payment(tableId, 0, {}, false, new Date(), []);
                        observer.next(fallback);
                    }
                },
                (error) => observer.error(error)
            );
        });
    }

    override closePayment(tableId: string): Observable<void> {
        const refPath = ref(this.database, `${this.basePath}/${this.menuKey}/${tableId}`);
        return new Observable((observer) => {
            update(refPath, { isClosed: true })
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[PaymentFirebaseRepository] - Payment closed for table ${tableId}`);
                })
                .catch((error) => observer.error(error));
        });
    }

    override deleteSubPayment(tableId: string, subPaymentKey: string): Observable<void> {
        const subRef = ref(this.database, `${this.basePath}/${this.menuKey}/${tableId}/subPayments/${subPaymentKey}`);
        return new Observable(observer => {
            remove(subRef)
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }
    updatePayment(tableId: string, payment: Payment): Observable<void> {
        const paymentRef = ref(this.database, `${this.basePath}/${this.menuKey}/${tableId}`);
        return new Observable(observer => {
            set(paymentRef, PaymentMapper.toJson(payment))
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[PaymentFirebaseRepository] - Payment updated for table ${tableId}`);
                })
                .catch(error => observer.error(error));
        });
    }

    deletePayment(tableId: string): Observable<void> {
        const path = `${this.basePath}/${this.menuKey}/${tableId}`;
        return new Observable(observer => {
            remove(ref(this.database, path))
                .then(() => {
                    observer.next();
                    observer.complete();
                    console.log(`[PaymentFirebaseRepository] - Payment deleted for table ${tableId}`);
                })
                .catch(error => observer.error(error));
        });
    }

}
