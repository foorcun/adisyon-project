import { CartItem } from "./cart-item";

export class Cart {
  constructor(
    public id: string, // Optional if not persisting carts
    public items: { [key: string]: CartItem } = {} // Store items as an object
  ) { }

  addItem(item: CartItem): void {
    if (this.items[item.product.id]) {
      this.items[item.product.id].quantity += item.quantity;
    } else {
      this.items[item.product.id] = item;
    }
  }

  removeItem(productId: string): void {
    delete this.items[productId]; // Remove item by key
  }

  updateItemQuantity(productId: string, quantity: number): void {
    if (this.items[productId]) {
      this.items[productId].quantity = quantity;
    }
  }

  clearCart(): void {
    this.items = {}; // Reset to an empty object
  }

  // logCartItems(): void {
  //   // console.log("[Cart] Logging items:");

  //   if (!this.items || Object.keys(this.items).length === 0) {
  //     console.warn("[Cart] No items found in cart.");
  //     return;
  //   }

  //   Object.entries(this.items).forEach(([key, item]) => {
  //     console.log(`[Cart] Item Key: ${key}`, item);

  //     console.log(`[Cart] Item Key: ${key}`, item.getTotalPrice);
  //   });
  // }

  get totalAmount(): number {
    // console.log("[Cart] totalAmount: Calculating total amount...");
    var total = 0;
    Object.entries(this.items).forEach(([key, item]) => {
      total += item.getTotalPrice;
    });
    return total;
  }

  getItem(productId: string): CartItem | undefined {
    return this.items[productId]; // Retrieve item by key
  }

  getItems(): CartItem[] {
    return Object.values(this.items); // Convert object to array for iteration
  }

  getItemsCount(): number {
    return Object.values(this.items).reduce((total, item) => total + item.quantity, 0);
  }
}
