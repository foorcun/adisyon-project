import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../MenuFeature/domain/entity/category.entity';
import { MenuFirebaseRepository } from '../../../MenuFeature/infrastructure/menu-firebase.repository';

@Component({
  selector: 'app-category-component',
  templateUrl: './category-component.component.html',
  styleUrls: ['./category-component.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CategoryComponentComponent implements OnInit {
  categories: Category[] = []; // ✅ Now an array instead of an object
  categoryForm: FormGroup;

  constructor(private menuRepository: MenuFirebaseRepository, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      displayOrder: [null] // ✅ Added displayOrder to form
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ Load categories from Firebase and sort them
  loadCategories() {
    this.menuRepository.listenForMenuChanges();
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        this.categories = this.sortCategories(menu.categories);
        console.log('Sorted Categories:', this.categories);
      }
    });
  }

  // ✅ Sort categories by displayOrder
  private sortCategories(categoriesObj: { [key: string]: Category }): Category[] {
    return Object.entries(categoriesObj)
      .map(([id, category]) => ({ ...category, id })) // Convert to array and preserve `id`
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
  }

  // ✅ Add a new category with displayOrder
  addCategory() {
    if (this.categoryForm.valid) {
      const newCategory = new Category(
        '',
        this.categoryForm.value.name,
        {},
        '',
        this.categoryForm.value.displayOrder
      );
      this.menuRepository.addCategory(newCategory).subscribe(() => {
        this.categoryForm.reset();
      });
    }
  }

  // ✅ Delete a category
  deleteCategory(categoryId: string) {
    this.menuRepository.removeCategory(categoryId).subscribe(() => {
      console.log(`Category ${categoryId} deleted.`);
      this.categories = this.categories.filter(category => category.id !== categoryId);
    });
  }

  // ✅ Update a category name
  updateCategoryName(categoryId: string, newName: string) {
    if (newName.trim()) {
      this.menuRepository.updateCategoryName(categoryId, newName.trim()).subscribe(() => {
        console.log(`Category ${categoryId} updated to ${newName}.`);
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          category.name = newName.trim();
        }
      });
    }
  }

  // ✅ Update category displayOrder
  updateDisplayOrder(categoryId: string, newDisplayOrder: string) {
    const orderValue = Number(newDisplayOrder);
    if (!isNaN(orderValue) && orderValue >= 0) {
      this.menuRepository.updateDisplayOrder(categoryId, orderValue).subscribe(() => {
        console.log(`Updated displayOrder for ${categoryId} to ${orderValue}`);
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          category.displayOrder = orderValue;
          this.categories = this.sortCategories(
            Object.fromEntries(this.categories.map(c => [c.id, c]))
          ); // ✅ Re-sort after update
        }
      });
    }
  }
}
