import { CartItem } from './cart-item';
import { Product } from './product.entity';

fdescribe('Domain Entity Test: Cart', () => {
  let product: Product;
  let cartItem: CartItem;

  beforeEach(() => {
    product = new Product(
      '1',
      'Test Product',
      'A test product description',
      50,
      'http://example.com/image.jpg',
      'category-1'
    );
  });

  it('should create a CartItem with the correct properties', () => {
    cartItem = new CartItem(product, 2);

    expect(cartItem.product).toBe(product);
    expect(cartItem.quantity).toBe(2);
  });

  it('should use a default quantity of 1 if not provided', () => {
    cartItem = new CartItem(product);

    expect(cartItem.product).toBe(product);
    expect(cartItem.quantity).toBe(1);
  });

  it('should calculate the total price correctly', () => {
    cartItem = new CartItem(product, 3);

    expect(cartItem.getTotalPrice).toBe(150); // 50 * 3 = 150
  });

  it('should return 0 as total price for zero quantity', () => {
    cartItem = new CartItem(product, 0);

    expect(cartItem.getTotalPrice).toBe(0); // 50 * 0 = 0
  });

  it('should calculate the total price correctly for negative quantity', () => {
    cartItem = new CartItem(product, -2);

    expect(cartItem.getTotalPrice).toBe(-100); // 50 * -2 = -100
  });
});
