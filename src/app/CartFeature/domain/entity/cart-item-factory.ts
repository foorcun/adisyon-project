import { Injectable } from '@angular/core';
import { Product } from './product.entity';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartItemFactory {
  /**
   * Creates a new CartItem instance.
   * @param productData Explicit data for the product, matching the Product interface.
   * @param quantity The quantity of the product (default is 1).
   * @returns A new CartItem instance.
   */
  create(
    productData: {
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: string;
    },
    quantity: number = 1
  ): CartItem {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    // Ensure product has the Product type
    const product: Product = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      imageUrl: productData.imageUrl,
      categoryId: productData.categoryId,
    };

    return new CartItem(product, quantity);
  }
}
