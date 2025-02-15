import { Category } from "../../../core/domain/entities/category.entity";
import { Product } from "../../../core/domain/entities/product.entity";

export function sortProductsByCategoryOrder(
  products: Product[],
  categories: Category[]
): Product[] {
  // Create a map of category IDs to their order
  const categoryOrderMap = categories.reduce((map, category, index) => {
    map[category.id] = index;
    return map;
  }, {} as Record<string, number>);

  // Sort products based on the order of their categoryId
  return products.sort((a, b) => {
    const categoryOrderA = categoryOrderMap[a.categoryId] ?? Number.MAX_SAFE_INTEGER;
    const categoryOrderB = categoryOrderMap[b.categoryId] ?? Number.MAX_SAFE_INTEGER;
    return categoryOrderA - categoryOrderB;
  });
}
