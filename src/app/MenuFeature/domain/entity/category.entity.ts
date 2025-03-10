import { MenuItem } from "./menuitem.entity";

export class Category {
    constructor(
        public id: string,
        public name: string,
        public menuItems: { [key: string]: MenuItem } = {},  // This expects `menuItems`, not `menuItem`
        public imageUrl: string = '', // This expects `imageUrl`, not `image`
        public displayOrder?: number,
    ) {}
}
