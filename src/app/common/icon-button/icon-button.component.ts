import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports:[CommonModule]
})
export class IconButtonComponent {
  @Input() iconClass: string = 'fas fa-utensils'; // Default to fork and knife
  @Input() label?: string; // Optional label for the button
  @Input() buttonClass?: string; // Additional classes for styling
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
