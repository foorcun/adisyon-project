import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../MenuFeature/domain/entity/category.entity';
import { MenuItem } from '../../../MenuFeature/domain/entity/menuitem.entity';
import { MenuFirebaseRepository } from '../../../MenuFeature/infrastructure/menu-firebase.repository';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class MenuItemComponent implements OnInit {
  // menuKey: string = 'menuKey1';
  categories: { [key: string]: Category } = {};
  selectedCategoryId: string | null = null;
  menuItems: { [key: string]: MenuItem } = {};

  // Track visibility of the add item form
  isAddItemVisible: boolean = false;

  // Track update status for visual feedback
  updatingItems: { [key: string]: boolean } = {};
  updatedItems: { [key: string]: boolean } = {};

  // Form to add a new menu item
  menuItemForm: FormGroup;

  constructor(private menuRepository: MenuFirebaseRepository, private fb: FormBuilder) {
    this.menuItemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load categories from Firebase
  loadCategories() {
    this.menuRepository.listenForMenuChanges();
    this.menuRepository.menu$.subscribe(menu => {
      if (menu?.categories) {
        this.categories = menu.categories;
        console.log('Categories:', this.categories);
      }
    });
  }

  // Handle category selection for displaying items
  onCategorySelect(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.loadMenuItems();
  }

  // Load menu items for the selected category
  loadMenuItems() {
    if (this.selectedCategoryId) {
      const category = this.categories[this.selectedCategoryId];
      if (category?.menuItems) {
        this.menuItems = category.menuItems;
      } else {
        this.menuItems = {};
      }
    }
  }

  // Toggle add menu item form visibility
  toggleAddItemForm() {
    this.isAddItemVisible = !this.isAddItemVisible;
  }

  // Add a new menu item
  addMenuItem() {
    if (this.menuItemForm.valid) {
      const newItem = new MenuItem(
        '',
        this.menuItemForm.value.name,
        this.menuItemForm.value.description,
        this.menuItemForm.value.price,
        this.menuItemForm.value.imageUrl
      );

      const selectedCategory = this.menuItemForm.value.categoryId;

      this.menuRepository.addMenuItem(selectedCategory, newItem).subscribe(() => {
        console.log('Menu item added successfully');
        this.menuItemForm.reset();
        this.isAddItemVisible = false; // Collapse the form after adding
        this.loadMenuItems();
      });
    } else {
      console.warn('Please fill all fields correctly.');
    }
  }

  // Delete a menu item
  deleteMenuItem(menuItemId: string) {
    if (this.selectedCategoryId) {
      this.menuRepository.removeMenuItem(this.selectedCategoryId, menuItemId).subscribe(() => {
        console.log(`Menu item ${menuItemId} deleted.`);
        this.loadMenuItems();
      });
    }
  }

  // Update a menu item with visual feedback
  updateMenuItem(menuItemId: string, name: string, description: string, price: number, imageUrl: string) {
    if (this.selectedCategoryId) {
      const updates: Partial<MenuItem> = { name, description, price, imageUrl };

      // Set loading state
      this.updatingItems[menuItemId] = true;
      this.updatedItems[menuItemId] = false;

      this.menuRepository.updateMenuItem(this.selectedCategoryId, menuItemId, updates).subscribe(() => {
        console.log(`Menu item ${menuItemId} updated.`);
        this.loadMenuItems();

        // Show success feedback
        this.updatingItems[menuItemId] = false;
        this.updatedItems[menuItemId] = true;

        // Reset success message after 2 seconds
        setTimeout(() => {
          this.updatedItems[menuItemId] = false;
        }, 2000);
      });
    }
  }

  // Helper to get category keys
  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }

  // Helper to get menu item keys
  getMenuItemKeys(): string[] {
    return Object.keys(this.menuItems);
  }
}
