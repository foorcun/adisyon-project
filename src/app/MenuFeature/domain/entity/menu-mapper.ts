import { Menu } from './menu.entity';
import { Category } from './category.entity';
import { CategoryMapper } from './category-mapper';

export class MenuMapper {
    static toMenu(data: unknown): Menu {
        if (!data || typeof data !== 'object') return new Menu('', '');

        const menuData = data as { [key: string]: any };

        const categories: { [key: string]: Category } = {};
        if (menuData['category'] && typeof menuData['category'] === 'object') {
            const categoryObj = menuData['category'] as Record<string, unknown>;
            for (const [key, value] of Object.entries(categoryObj)) {
                categories[key] = CategoryMapper.toCategory(value, key);
            }
        }

        return new Menu(
            menuData['id'] || '',
            menuData['name'] || '',
            categories
        );
    }
}
