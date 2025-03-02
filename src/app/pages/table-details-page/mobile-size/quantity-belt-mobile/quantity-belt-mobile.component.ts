import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quantity-belt-mobile',
  imports: [CommonModule],
  templateUrl: './quantity-belt-mobile.component.html',
  styleUrl: './quantity-belt-mobile.component.scss'
})
export class QuantityBeltMobileComponent {

  quantities: number[] = [0.5, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectQuantity(quantity: number) {
    console.log("Selected quantity:", quantity);
    // You can store the selected quantity in a variable or pass it to a service
  }
}
