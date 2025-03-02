import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quantity-belt',
  imports: [CommonModule],
  templateUrl: './quantity-belt.component.html',
  styleUrl: './quantity-belt.component.scss'
})
export class QuantityBeltComponent {

  quantities: number[] = [0.5, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectQuantity(quantity: number) {
    console.log("Selected quantity:", quantity);
    // You can store the selected quantity in a variable or pass it to a service
  }
}
