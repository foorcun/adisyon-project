import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { CategoryProducts } from './models/category-products.entity';
import { CommonModule } from '@angular/common';
import { Category } from '../../MenuFeature/domain/entity/category.entity';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';

@Component({
  selector: 'app-menu-page',
  imports: [CommonModule ],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent implements OnInit {

  // categories$: Observable<Category[]> | undefined;

  categories: { [key: string]: Category } = {};
  // categoryProducts$: Observable<CategoryProducts[]> | undefined;

  // // isModalOpen = false;

  constructor(
    private menuRepository: MenuFirebaseRepository,
    // private modalService: ModalService,
    // private menuItemPageFacadeService: MenuItemPageFacadeService
  ) { }

  // ngOnInit(): void {
  //   this.categories$ = this.menuPageFacadeService.getCategories();
  //   this.categoryProducts$ = this.menuPageFacadeService.getProductsGroupedByCategory();
  // }


  ngOnInit(): void {
    this.loadCategories();
  }

  // Load categories from Firebase
  loadCategories() {
    this.menuRepository.listenForMenuChanges('menuKey1');
    this.menuRepository.menu$.subscribe(menu => {
      if (menu && menu.categories) {
        this.categories = menu.categories;
        console.log('Categories:', this.categories);
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
