import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-now-footer',
  templateUrl: './order-now-footer.component.html',
  styleUrls: ['./order-now-footer.component.scss']
})
export class OrderNowFooterComponent {
  @Output() orderNowClicked = new EventEmitter<void>(); // Emits when the "Order Now" button is clicked

  onOrderNow(): void {
    this.orderNowClicked.emit();
  }
}
