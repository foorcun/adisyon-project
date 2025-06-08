import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap, combineLatest, take, of } from 'rxjs';
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

    selectedTablePaymentSubPayment$ = this.selectedTablePayment$.pipe(
        filter((payment): payment is Payment => !!payment && !!payment.subPayments),
        map(payment => Object.values(payment.subPayments))
    );

    readonly selectedProductQuantities$ = this.selectedTablePaymentSubPayment$.pipe(
        map(subPayments => {
            const countMap = new Map<string, number>();
            subPayments.forEach(sp => {
                sp.subPaymentItems.forEach(item => {
                    const current = countMap.get(item.productId) || 0;
                    countMap.set(item.productId, current + item.quantity);
                });
            });
            return Array.from(countMap.entries()).map(([productId, totalQuantity]) => ({
                productId,
                totalQuantity
            }));
        })
    );

    constructor(
        private paymentRepository: PaymentFirebaseRepository,
        private orderService: OrderService,
        private tableService: TableService
    ) {
        this.listenForPayments();
    }

    private listenForPayments(): void {
        this.paymentRepository.payments$.subscribe(paymentsMap => {
            console.log('[PaymentService] Payments received:', paymentsMap);
            this.paymentsSubject.next(paymentsMap);
        });

        combineLatest([
            this.tableService.selectedTable$,
            this.orderService.orders$,
            this.payments$
        ])
            .pipe(filter(([selectedTable]) => !!selectedTable))
            .subscribe(([selectedTable, orders, paymentsMap]) => {
                const tableId = selectedTable!.id;
                let payment = paymentsMap[tableId];

                if (!payment) {
                    this.initializePaymentIfNotExists(tableId);
                    return;
                }

                const relatedOrders = Object.values(orders).filter(order => order.tableUUID === tableId);
                payment.orders = PaymentFactory.convertOrdersToPaymentOrders(relatedOrders);
                this.paymentRepository.updatePayment(tableId, payment).subscribe();
                this.selectedTablePaymentSubject.next(payment);

                this.findProductSubPayments('-ORaTydw_dw8bdkDRv-R').subscribe(result => {
                    console.log('[PaymentService] SubPayments for product:', result);
                });
            });

        this.selectedTablePaymentSubPayment$.subscribe(subPayments => {
            console.log('[PaymentService] SubPayments for selected table:', subPayments);
        });
    }

    private initializePaymentIfNotExists(tableId: string): void {
        this.getPaymentByTableId(tableId).pipe(take(1)).subscribe(payment => {
            if (!payment || !payment.createdAt) {
                console.log(`[PaymentService] No payment found on Firebase. Initializing for table ${tableId}`);
                this.initializePayment(tableId, 0).subscribe(() => {
                    console.log('[PaymentService] Payment initialized.');
                });
            } else {
                console.log(`[PaymentService] Payment already exists for table ${tableId}`);
            }
        });
    }

    getPayments(): { [key: string]: Payment } {
        const payments = this.paymentsSubject.getValue();
        return Object.entries(payments)
            .sort(([, a], [, b]) => a.tableId.localeCompare(b.tableId, undefined, { numeric: true }))
            .reduce((acc, [key, payment]) => {
                acc[key] = payment;
                return acc;
            }, {} as { [key: string]: Payment });
    }

    getPaymentByTableIdSync(tableId: string): Payment | undefined {
        return this.paymentsSubject.getValue()[tableId];
    }

    getPaymentByTableId(tableId: string): Observable<Payment> {
        return this.paymentRepository.getPaymentByTableId(tableId);
    }

    initializePayment(tableId: string, totalAmount: number): Observable<void> {
        return this.paymentRepository.initializePayment(tableId, totalAmount);
    }

    addSubPayment(command: PaymentCommand): Observable<void> {
        return this.paymentRepository.addSubPayment(command);
    }

    closePayment(tableId: string): Observable<void> {
        return this.paymentRepository.closePayment(tableId);
    }

    deleteSubPayment(tableId: string, subPaymentKey: string): Observable<void> {
        console.log('[PaymentService] deleteSubPayment', tableId, subPaymentKey);
        return this.paymentRepository.deleteSubPayment(tableId, subPaymentKey);
    }

    findProductSubPayments(productId: string): Observable<{
        matchedSubPayments: SubPayment[];
        totalPaidQuantity: number;
    }> {
        console.log("[PaymentService] start");
        return this.selectedTablePayment$.pipe(
            tap(payment => console.log("[PaymentService] payment received", payment)),
            filter((payment): payment is Payment => !!payment && !!payment.subPayments),
            map(payment => {
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
                console.log("[PaymentService] matchedSubPayments", matchedSubPayments);
                return { matchedSubPayments, totalPaidQuantity };
            })
        );
    }

    deletePayment(tableId: string): Observable<void> {
        // return this.paymentRepository.deletePayment(tableId);
        return this.paymentRepository.deleteSubPayments(tableId);
        // console.log('[PaymentService] deletePayment', tableId);
        // return of(void 0);
    }

}
