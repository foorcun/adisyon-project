import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quantity-button-group',
  templateUrl: './quantity-button-group.component.html',
  styleUrls: ['./quantity-button-group.component.scss'],
  imports: [CommonModule]
})
export class QuantityButtonGroupComponent {
  @Input() quantity!: number;
  @Input() productId!: string;
  @Output() increase = new EventEmitter<string>();
  @Output() decrease = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  onIncrease(): void {
    this.increase.emit(this.productId);
  }

  onDecrease(): void {
    this.decrease.emit(this.productId);
  }

  onRemove(): void {
    this.remove.emit(this.productId);
  }
}
