import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../OrderFeature/domain/entities/order.entity';
import { OrderStatus } from '../../../OrderFeature/domain/entities/order-status';
import { OrderPageFacadeService } from '../../../services/order-page.facade.service';
import { OrderPageContentBacklogComponent } from './order-page-content-backlog/order-page-content-backlog.component';
import { OrderPageContentToDoComponent } from './order-page-content-to-do/order-page-content-to-do.component';
import { OrderPageContentInProgressComponent } from './order-page-content-in-progress/order-page-content-in-progress.component';

@Component({
  selector: 'app-order-page-content',
  imports: [CommonModule, FormsModule,
     OrderPageContentBacklogComponent, OrderPageContentInProgressComponent, OrderPageContentToDoComponent],
  templateUrl: './order-page-content.component.html',
  styleUrl: './order-page-content.component.scss'
})
export class OrderPageContentComponent {
}
