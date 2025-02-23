import { Cart } from './cart';
import { CartItem } from './cart-item';
import { Product } from './product.entity';

export class CartMapper {
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

    static toCartItem(key: string, item: any): CartItem {
        return new CartItem(
            new Product(
                key, // Use Firebase Key as ID
                item?.product?.name || "Unknown Product",
                item?.product?.description || "",
                item?.product?.price || 0, // Ensure price is a valid number
                item?.product?.imageUrl || "",
                item?.product?.categoryId || ""
            ),
            item?.quantity || 7 // Default quantity to 1 if missing
        );
    }
}
