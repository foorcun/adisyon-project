import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../../../MenuFeature/domain/entity/category.entity';
import { Subscription } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../../../services/table-details-page.facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-area-mobile',
  imports: [CommonModule],
  templateUrl: './category-area-mobile.component.html',
  styleUrl: './category-area-mobile.component.scss'
})
export class CategoryAreaMobileComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private categoriesSubscription!: Subscription;

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService,
  ) { }

  ngOnInit(): void {
    this.categoriesSubscription = this.tableDetailsPageFacadeService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

  setSelectedCategory(categoryName: string) {
    const category = this.categories.find(category => category.name === categoryName);
    if (category) {
      // console.log(`[CategoryAreaComponent] - Category: ${category.name}`);
      // console.log(`[CategoryAreaComponent] - Menu Items (JSON): ${JSON.stringify(category.menuItems, null, 2)}`);

      this.tableDetailsPageFacadeService.setSelectedCategory(category);
    }
  }
}
