import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { CategoryProducts } from './models/category-products.entity';
import { CommonModule } from '@angular/common';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';
import { MenuItem } from '../../MenuFeature/domain/entity/menuitem.entity';

export interface CategoryProducts {
  category: Category;
  menuItems: MenuItem[];
}

@Component({
  selector: 'app-menu-page',
  imports: [CommonModule],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent implements OnInit {

  categories: { [key: string]: Category } = {};
  categoryProducts: CategoryProducts[] = [];

  constructor(
    private menuRepository: MenuFirebaseRepository,
  ) { }


  ngOnInit(): void {
    this.loadCategories();
  }

  // Load categories from Firebase
  loadCategories() {
    this.menuRepository.listenForMenuChanges('menuKey1');
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        // Assign categories directly
        this.categories = menu.categories;
        console.log('Categories:', this.categories);

        // Transform into categoryProducts
        this.categoryProducts = Object.entries(menu.categories).map(([categoryId, category]) => {
          // Convert menuItems object into array for categoryProducts
          const menuItemsArray = Object.entries(category.menuItems || {}).map(([menuItemId, menuItem]) => ({
            id: menuItemId,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            imageUrl: menuItem.imageUrl
          }));

          return {
            category: {
              id: categoryId,
              name: category.name,
              imageUrl: category.imageUrl,
              menuItems: category.menuItems // <-- Keep original object structure
            },
            menuItems: menuItemsArray // <-- Provide array for CategoryProducts interface
          };
        });

        console.log('Category Products:', this.categoryProducts);
      }
    });
  }




  scrollToCategory(categoryId: string) {
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  // // openModal() {
  // //   this.isModalOpen = true;
  // // }

  // // closeModal() {
  // //   this.isModalOpen = false;
  // // }

  // openProductModal(product: Product): void {
  //   console.log('burdakki product', product);

  //   // var cartItem: CartItem = new CartItem({id: "1",}, 1);
  //   var cartItem: CartItem = new CartItemFactory().create({
  //     id: product.id,
  //     name: product.name,
  //     description: product.description,
  //     price: product.price,
  //     imageUrl: product.imageUrl,
  //     categoryId: product.categoryId
  //   }, 1);

  //   console.log('burdakki cartItem', cartItem);
  //   console.log('burdakki cartItem.product', cartItem.product);

  //   this.menuItemPageFacadeService.setSelectedMenuItem(cartItem);
  //   this.modalService.openModal({
  //     title: product.name,
  //     description: product.description,
  //   });
  // }
}
