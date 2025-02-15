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
  categories: { [key: string]: Category } = {};
  menuKey = 'menuKey1'; // Replace with actual menu key
  categoryForm: FormGroup;

  constructor(private menuRepository: MenuFirebaseRepository, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load categories from Firebase
  loadCategories() {
    this.menuRepository.listenForMenuChanges(this.menuKey);
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        this.categories = menu.categories;
        console.log('Categories:', this.categories);
      }
    });
  }

  // Add a new category
  addCategory() {
    if (this.categoryForm.valid) {
      const newCategory = new Category('', this.categoryForm.value.name);
      this.menuRepository.addCategory(this.menuKey, newCategory).subscribe(() => {
        this.categoryForm.reset();
      });
    }
  }

  // Delete a category
  deleteCategory(categoryId: string) {
    this.menuRepository.removeCategory(this.menuKey, categoryId).subscribe(() => {
      console.log(`Category ${categoryId} deleted.`);
    });
  }

  // Update a category name
  updateCategoryName(categoryId: string, newName: string) {
    this.menuRepository.updateCategoryName(this.menuKey, categoryId, newName).subscribe(() => {
      console.log(`Category ${categoryId} updated to ${newName}.`);
    });
  }

  // ✅ Helper method to get keys of categories
  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }
}
