import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { OrderModalService } from '../../../services/order-modal.service';

@Component({
  selector: 'app-order-page-navbar',
  imports: [CommonModule],
  templateUrl: './order-page-navbar.component.html',
  styleUrl: './order-page-navbar.component.scss'
})
export class OrderPageNavbarComponent {

  constructor(
    // private orderModalService: OrderModalService
    private router: Router
  ) {}

  closeOrderModal() {
    // this.orderModalService.closeModal();
    this.router.navigate(['/']);
  }
}
