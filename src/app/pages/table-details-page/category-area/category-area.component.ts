import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../MenuFeature/domain/entity/category.entity';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';

@Component({
  selector: 'app-category-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-area.component.html',
  styleUrls: ['./category-area.component.scss']
})
export class CategoryAreaComponent {
  @Input() categories: Category[] = [];
  @Input() loading: boolean = false;


  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService
  ) { }

  setSelectedCategory(categoryName: string) {
    const category = this.categories.find(category => category.name === categoryName);
    if (category) {
      // console.log(`[CategoryAreaComponent] - Category: ${category.name}`);
      // console.log(`[CategoryAreaComponent] - Menu Items (JSON): ${JSON.stringify(category.menuItems, null, 2)}`);

      this.tableDetailsPageFacadeService.setSelectedCategory(category);
    }
  }

}
