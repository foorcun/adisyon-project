import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OrderFirebaseRepository } from './order-firebase.repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { ProductOrder } from '../../domain/entities/product-order.entity';

fdescribe('Order Firebase Repository (Real HTTP)', () => {
  let service: OrderFirebaseRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [OrderFirebaseRepository],
    });
    service = TestBed.inject(OrderFirebaseRepository);
  });

  xit('should fetch orders as Order[]', (done: DoneFn) => {
    console.log('######### Order Firebase Repository (Real HTTP) #########');

    service.getAllOrders().subscribe((orders: Order[]) => {
      expect(orders).toBeTruthy();
      console.log('Fetched Orders:', orders);

      expect(orders.length).toBeGreaterThan(0);

      const order = orders[0];
      expect(order).toBeDefined();
      expect(order.items).toBeTruthy();
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.tableName).toBeDefined();
      expect(order.status).toBeDefined();
      expect(order.userUid).toBeDefined(); // Ensure userUid is present

      console.log('######### Order Firebase Repository (Real HTTP) ENDS #########');
      done();
    });
  });

  xit('should fetch an order by ID', (done: DoneFn) => {
    const orderId = '-Mq8K3J8d9aL7n1Txyz'; // Replace with a valid Firebase order ID for testing

    service.getOrderById(orderId).subscribe((order: Order) => {
      expect(order).toBeTruthy();
      expect(order.id).toBe(orderId);
      console.log('Fetched Order:', order);

      expect(order.items.length).toBeGreaterThan(0);
      expect(order.tableName).toBe('Table 5');
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.userUid).toBeDefined(); // Ensure userUid is present

      done();
    });
  });

  xit('should create a new order with Firebase-generated ID', (done: DoneFn) => {
    const newOrder = new Order(
      '',
      [
        new OrderItem(
          new ProductOrder('prod1', 'Burger', 'Delicious burger', 12.99, 'image-url'),
          2
        ),
      ],
      'Table 10',
      OrderStatus.PENDING,
      new Date(),
      new Date(),
      25.98, // Total amount
      'user123' // Example user UID
    );

    service.createOrder(newOrder).subscribe({
      next: (generatedId: string) => {
        console.log('Order created successfully with ID:', generatedId);
        service.getOrderById(generatedId).subscribe((order: Order) => {
          expect(order).toBeTruthy();
          expect(order.id).toBe(generatedId);
          expect(order.userUid).toBe('user123'); // Validate user UID
          console.log('Created Order:', order);
          done();
        });
      },
      error: (err) => {
        console.error('Error creating order:', err);
        done.fail(err);
      },
    });
  });

  xit('should update order status', (done: DoneFn) => {
    const orderId = '-Mq8K3J8d9aL7n1Txyz'; // Replace with a valid Firebase order ID for testing
    const newStatus = OrderStatus.COMPLETED;

    service.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        console.log('Order status updated successfully.');
        service.getOrderById(orderId).subscribe((order: Order) => {
          expect(order).toBeTruthy();
          expect(order.status).toBe(newStatus);
          console.log('Updated Order:', order);
          done();
        });
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        done.fail(err);
      },
    });
  });

  xit('should delete an order', (done: DoneFn) => {
    const orderId = '-Mq8K3J8d9aL7n1Txyz'; // Replace with a valid Firebase order ID for testing

    service.deleteOrder(orderId).subscribe({
      next: () => {
        console.log('Order deleted successfully.');
        service.getOrderById(orderId).subscribe({
          next: () => {
            done.fail('Order should not exist after deletion.');
          },
          error: (err) => {
            console.log('Expected error after deletion:', err.message);
            expect(err).toBeTruthy();
            done();
          },
        });
      },
      error: (err) => {
        console.error('Error deleting order:', err);
        done.fail(err);
      },
    });
  });
});
