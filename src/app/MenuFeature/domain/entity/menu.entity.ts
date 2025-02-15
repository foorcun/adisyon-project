import { Category } from "./category.entity";

export class Menu {
    constructor(
        public id: string,
        public name: string,
        public categories: { [key: string]: Category } = {}
    ) {}
}
