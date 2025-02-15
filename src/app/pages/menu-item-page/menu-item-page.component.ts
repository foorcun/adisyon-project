import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';

@Component({
  selector: 'app-menu-item-page',
  templateUrl: './menu-item-page.component.html',
  styleUrls: ['./menu-item-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuItemPageComponent implements OnInit {
  menuKey = 'menuKey1';
  categories: { [key: string]: Category } = {};

  constructor(private menuRepository: MenuFirebaseRepository) {}

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

  // Scroll to selected category
  scrollToCategory(categoryId: string) {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Helper to get category keys
  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }

  // Helper to get menu item keys for a given category
  getMenuItemKeys(category: Category): string[] {
    return Object.keys(category.menuItems || {});
  }
}
