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
  categories: Category[] = [];
  categoryForm: FormGroup;
  isAddingCategory = false;

  constructor(private menuRepository: MenuFirebaseRepository, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      displayOrder: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.menuRepository.listenForMenuChanges();
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        this.categories = this.sortCategories(menu.categories);
      }
    });
  }

  private sortCategories(categoriesObj: { [key: string]: Category }): Category[] {
    return Object.entries(categoriesObj)
      .map(([id, category]) => ({ ...category, id }))
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
  }

  // onAddCardSubmit(): void {
  //   if (this.categoryForm.valid) {
  //     this.addCategory();
  //     this.isAddingCategory = false;
  //   }
  // }

  // cancelAddCard(): void {
  //   this.categoryForm.reset();
  //   this.isAddingCategory = false;
  // }

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

  deleteCategory(categoryId: string) {
    this.menuRepository.removeCategory(categoryId).subscribe(() => {
      this.categories = this.categories.filter(category => category.id !== categoryId);
    });
  }

  updateCategoryName(categoryId: string, newName: string) {
    if (newName.trim()) {
      this.menuRepository.updateCategoryName(categoryId, newName.trim()).subscribe(() => {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          category.name = newName.trim();
        }
      });
    }
  }

  updateDisplayOrder(categoryId: string, newDisplayOrder: string) {
    const orderValue = Number(newDisplayOrder);
    if (!isNaN(orderValue) && orderValue >= 0) {
      this.menuRepository.updateDisplayOrder(categoryId, orderValue).subscribe(() => {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          category.displayOrder = orderValue;
          this.categories = this.sortCategories(
            Object.fromEntries(this.categories.map(c => [c.id, c]))
          );
        }
      });
    }
  }
  openAddForm(): void {
    this.isAddingCategory = true;
  }

  onAddCardSubmit(event: Event): void {
    event.stopPropagation();
    if (this.categoryForm.valid) {
      this.addCategory();
      this.isAddingCategory = false;
    }
  }

  cancelAddCard(): void {
    this.categoryForm.reset();
    this.isAddingCategory = false;
  }

}