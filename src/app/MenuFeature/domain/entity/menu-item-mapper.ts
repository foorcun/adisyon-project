import { MenuItem } from "./menuitem.entity";

export class MenuItemMapper {
    static toMenuItem(data: any, id: string): MenuItem {
        if (!data) return new MenuItem('', '', '', 0);

        return new MenuItem(
            id,
            data.name || '',
            data.description || '',
            data.price || 0,
            data.imageUrl || ''
        );
    }

    static toMenuItemCollection(data: any): { [key: string]: MenuItem } {
        const items: { [key: string]: MenuItem } = {};
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                items[key] = this.toMenuItem(value, key);
            }
        }
        return items;
    }
}
