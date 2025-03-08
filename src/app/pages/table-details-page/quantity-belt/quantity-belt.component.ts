import { Component } from '@angular/core';
import { TableDetailsPageFacadeService } from '../../../services/table-details-page.facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-belt',
  imports: [CommonModule],
  templateUrl: './quantity-belt.component.html',
  styleUrl: './quantity-belt.component.scss'
})
export class QuantityBeltComponent {


  quantities: number[] = [0.5, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private tableDetailsPageFacadeService: TableDetailsPageFacadeService
  ) {}

  selectQuantity(quantity: number) {
    console.log("Selected quantity:", quantity);
    // You can store the selected quantity in a variable or pass it to a service
    this.tableDetailsPageFacadeService.selectedQuantity = quantity;
  }
}
