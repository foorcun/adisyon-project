import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../MenuFeature/domain/entity/category.entity';

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
}
