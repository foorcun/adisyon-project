import { Category } from './category.entity';
import { MenuItemMapper } from './menu-item-mapper';
import { MenuItem } from './menuitem.entity';

export class CategoryMapper {
    static toCategory(data: unknown, id: string): Category {
        if (!data || typeof data !== 'object') return new Category(id, '');

        const categoryData = data as { [key: string]: any };
        const menuItems: { [key: string]: MenuItem } = {};

        // Map 'menuItem' from Firebase into 'menuItems' for the Category entity
        if (categoryData['menuItem'] && typeof categoryData['menuItem'] === 'object') {
            const items = categoryData['menuItem'] as Record<string, unknown>;
            for (const [key, value] of Object.entries(items)) {
                menuItems[key] = MenuItemMapper.toMenuItem(value, key);
            }
        }

        return new Category(
            id,
            categoryData['name'] || '',
            menuItems,
            categoryData['imageUrl'] || '', // Ensures imageUrl is mapped
            categoryData['displayOrder'] !== undefined ? Number(categoryData['displayOrder']) : undefined // ✅ Includes displayOrder
        );
    }
}
