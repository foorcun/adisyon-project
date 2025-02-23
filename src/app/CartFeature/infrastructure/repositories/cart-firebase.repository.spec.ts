// import { TestBed } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { CartItem } from '../../domain/entity/cart-item';
// import { Cart } from '../../domain/entity/cart';
// import { Product } from '../../domain/entity/product.entity';
// import { CartItemAddCommand } from '../../application/usecases/cart/cart-item-add.command'; // Adjust the path as necessary
// import { CartFirebaseRepository } from './cart-firebase.repository';

// fdescribe('Cart Firebase Repository (Real HTTP)', () => {
//   let service: CartFirebaseRepository;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientModule],
//       providers: [CartFirebaseRepository],
//     });
//     service = TestBed.inject(CartFirebaseRepository);
//   });

//   it('should fetch cart items as CartItem[]', (done: DoneFn) => {
//     console.log('######### Cart Firebase Repository (Real HTTP) #########');

//     const userKey = 'userKey1'; // Set a valid user key for testing

//     service.getCart(userKey).subscribe((cart: Cart) => {
//       expect(cart).toBeTruthy();
//       expect(cart.getItems()).toBeTruthy();
//       console.log(cart.getItems());

//       expect(cart.getItems().length).toBeGreaterThan(0);

//       const cartItem = cart.getItems()[0];
//       expect(cartItem).toBeDefined();
//       expect(cartItem.product).toBeDefined();
//       expect(cartItem.quantity).toBeGreaterThan(0);

//       console.log('######### Cart Firebase Repository (Real HTTP) ENDS #########');
//       done();
//     });
//   });

//   xit('should add a new item to the cart using CartItemAddCommand', (done: DoneFn) => {
//     const newItem = new CartItem(
//       new Product(
//         '81',
//         'Brownie',
//         'Çikolatalı Brownie',
//         80.0,
//         'logo/brownie-logo.png',
//         'category11'
//       ),
//       2
//     );

//     const userKey = 'userKey1'; // Set a valid user key for testing
//     const command = new CartItemAddCommand(userKey, newItem);

//     service.addItem(command).subscribe({
//       next: () => {
//         console.log('Item added successfully.');
//         service.getCart(userKey).subscribe((cart: Cart) => {
//           const addedItem = cart.getItems().find((item) => item.product.id === '81');
//           expect(addedItem).toBeDefined();
//           expect(addedItem?.quantity).toEqual(2);
//           console.log('Added item:', addedItem);
//           done();
//         });
//       },
//       error: (err) => {
//         console.error('Error adding item:', err);
//         done.fail(err);
//       },
//     });
//   });

//   xit('should clear the cart', (done: DoneFn) => {
//     const userKey = 'userKey1'; // Set a valid user key for testing

//     service.clearCart(userKey).subscribe({
//       next: () => {
//         console.log('Cart cleared successfully.');
//         service.getCart(userKey).subscribe((cart: Cart) => {
//           expect(cart.getItems().length).toEqual(0);
//           console.log('Cart after clearing:', cart);
//           done();
//         });
//       },
//       error: (err) => {
//         console.error('Error clearing cart:', err);
//         done.fail(err);
//       },
//     });
//   });
// });
