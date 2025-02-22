// import { TestBed } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { OrderApiRepository } from './order-api.repository';
// import { Order } from '../../domain/entities/order.entity';

// describe('Order Api Repository (Real HTTP)', () => {
//     let service: OrderApiRepository;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//             providers: [OrderApiRepository],
//         });
//         service = TestBed.inject(OrderApiRepository);
//     });

//     it('should fetch orders as Order[]', (done: DoneFn) => {

//         console.log('######### Order Api Repository (Real HTTP) #########');
//         service.getAllOrders().subscribe((orders: Order[]) => {
//             expect(orders).toBeTruthy();
//             expect(orders.length).toBeGreaterThan(0);

//             const order = orders[0];
//             expect(order).toBeDefined();
//             expect(order.id).toBeDefined();
//             expect(order.items).toBeDefined();
//             expect(order.totalAmount).toBeDefined();
//             expect(order.datePlaced).toBeDefined();
//             expect(order.customerId).toBeDefined();
//             expect(order.status).toBeDefined();

//             console.log('Order:', order.id, order.totalAmount);

//             orders.forEach((o) => {
//                 console.log('Order:', o.id, 'Total:', o.totalAmount);
//                 o.items.forEach((item) => {
//                     console.log('  - Item:', item.product.name, 'Quantity:', item.quantity, 'Price:', item.price);
//                 });
//             });

//             console.log('######### Order Api Repository (Real HTTP) ENDS #########');
//             done();
//         });
//     });

//     it('should fetch a single order by ID', (done: DoneFn) => {
//         const testOrderId = 'order1'; // Replace with a valid ID from your mock data

//         service.getOrderById(testOrderId).subscribe((order: Order) => {
//             expect(order).toBeDefined();
//             expect(order.id).toBe(testOrderId);
//             expect(order.items).toBeDefined();
//             expect(order.totalAmount).toBeGreaterThan(0);

//             console.log('Fetched Order:', order.id, 'Total:', order.totalAmount);
//             order.items.forEach((item) => {
//                 console.log('  - Item:', item.product.name, 'Quantity:', item.quantity, 'Price:', item.price);
//             });

//             done();
//         });
//     });
// });
