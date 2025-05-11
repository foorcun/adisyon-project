import { Injectable } from '@angular/core';
import { Database, ref, push, set, update, onValue, DataSnapshot,remove } from '@angular/fire/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaymentRepository } from '../domain/repositories/payment-repository';
import { Payment } from '../domain/entities/payment.entity';
import { PaymentCommand } from '../domain/entities/payment-command';
import { SubPayment } from '../domain/entities/sub-payment.entity';

@Injectable({
    providedIn: 'root',
})
export class PaymentFirebaseRepository extends PaymentRepository {
    private basePath = 'payments';
    private paymentsSubject = new BehaviorSubject<Payment[]>([]);
    payments$ = this.paymentsSubject.asObservable();

    constructor(private database: Database) {
        super();
        this.listenForPayments();
    }

    private listenForPayments(): void {
        const paymentsRef = ref(this.database, this.basePath);
        onValue(
            paymentsRef,
            (snapshot: DataSnapshot) => {
                const data = snapshot.val();
                if (data) {
                    const payments = Object.keys(data).map((key) => {
                        const payment = data[key];
                        const subPayments: SubPayment[] = payment.subPayments
                            ? Object.values(payment.subPayments).map((sp: any) => SubPayment.fromPlainObject(sp))
                            : [];

                        return new Payment(
                            payment.tableId,
                            payment.totalAmount,
                            subPayments,
                            payment.isClosed,
                            new Date(payment.createdAt)
                        );
                    });
                    this.paymentsSubject.next(payments);
                } else {
                    this.paymentsSubject.next([]);
                }
            },
            (error) => {
                console.error('[PaymentFirebaseRepository] - Error listening to payments:', error.message);
            }
        );
    }

    override initializePayment(tableId: string, totalAmount: number): Observable<void> {
        const paymentRef = ref(this.database, `${this.basePath}/${tableId}`);
        const payment = {
            tableId,
            totalAmount,
            subPayments: [],
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
        const subPayment = new SubPayment(command.method, command.amount);
        const paymentRef = ref(this.database, `${this.basePath}/${command.tableId}/subPayments`);

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
        const refPath = ref(this.database, `${this.basePath}/${tableId}`);
        return new Observable((observer) => {
            onValue(
                refPath,
                (snapshot: DataSnapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const subPayments: SubPayment[] = data.subPayments
                            ? Object.values(data.subPayments).map((sp: any) => SubPayment.fromPlainObject(sp))
                            : [];

                        const payment = new Payment(
                            data.tableId,
                            data.totalAmount,
                            subPayments,
                            data.isClosed,
                            new Date(data.createdAt)
                        );

                        observer.next(payment);
                    } else {
                        observer.error(new Error(`No payment found for table ${tableId}`));
                    }
                },
                (error) => observer.error(error)
            );
        });
    }

    override closePayment(tableId: string): Observable<void> {
        const refPath = ref(this.database, `${this.basePath}/${tableId}`);
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
        console.log("[PaymentFirebaseRepository]3 deleteSubPayment", tableId, subPaymentKey);
        const subRef = ref(this.database, `payments/${tableId}/subPayments/${subPaymentKey}`);
        return new Observable(observer => {
            remove(subRef)
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }

}
