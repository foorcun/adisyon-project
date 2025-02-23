// import { TestBed } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { CartApiRepository } from './cart-api.repository';
// import { CartItem } from '../../domain/entity/cart-item';
// import { Cart } from '../../domain/entity/cart';

// describe('Cart Api Repository (Real HTTP)', () => {
//     let service: CartApiRepository;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//             providers: [CartApiRepository],
//         });
//         service = TestBed.inject(CartApiRepository);
//     });

//     it('should fetch cart items as CartItem[]', (done: DoneFn) => {

//         console.log('######### Cart Api Repository (Real HTTP) #########');
//         service.getCart().subscribe((cart: Cart) => {
//             expect(cart.getItems).toBeTruthy();
//             console.log(cart.getItems());

//             expect(cart.getItems().length).toBeGreaterThan(0);

//             const cartItem = cart.getItems()[0];
//             expect(cartItem).toBeDefined();
//             expect(cartItem.product).toBeDefined();
//             // expect(order.items).toBeDefined();
//             // expect(order.totalAmount).toBeDefined();
//             // expect(order.datePlaced).toBeDefined();
//             // expect(order.customerId).toBeDefined();
//             // expect(order.status).toBeDefined();

//             // console.log('Order:', order.id, order.totalAmount);

//             // orders.forEach((o) => {
//             //     console.log('Order:', o.id, 'Total:', o.totalAmount);
//             //     o.items.forEach((item) => {
//             //         console.log('  - Item:', item.product.name, 'Quantity:', item.quantity, 'Price:', item.price);
//             //     });
//             // });

//             console.log('######### Order Api Repository (Real HTTP) ENDS #########');
//             done();
//         });
//     });

// });
