import { Cart } from './cart';
import { CartItem } from './cart-item';
import { Product } from './product.entity';

export class CartMapper {
    /**
     * Converts raw Firebase data to a `Cart` object.
     * @param cartData Raw Firebase object
     * @returns `Cart` instance
     */
    static toCart(cartData: any): Cart {
        return new Cart(
            cartData?.id || '', // Ensure ID exists
            cartData?.items && typeof cartData.items === 'object'
                ? Object.fromEntries(
                    Object.entries(cartData.items).map(([key, item]) => [key, CartMapper.toCartItem(key, item)])
                ) // Keep items as an object instead of an array
                : {} // Default to an empty object if items are missing
        );
    }

    /**
     * Converts raw Firebase data to a `CartItem` object.
     * @param key Firebase document ID (used as item ID)
     * @param item Raw Firebase item data
     * @returns `CartItem` instance
     */
    static toCartItem(key: string, item: any): CartItem {
        var cand = new CartItem(
            new Product(
                key, // Use Firebase Key as ID
                item?.product?.name || "Unknown Product",
                item?.product?.description || "",
                item?.product?.price || 0, // Ensure price is a valid number
                item?.product?.imageUrl || "",
                item?.product?.categoryId || ""
            ),
            item?.quantity || 1, // Default quantity
        );
        cand.urunNotu = item?.urunNotu || "" // ✅ Ensure urunNotu is correctly mapped
        return cand;
    }
}
