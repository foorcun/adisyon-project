import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageBeltComponent } from "./message-belt/message-belt.component";
import { IconButtonComponent } from '../../../common/icon-button/icon-button.component';

@Component({
  selector: 'app-message-menu-belt',
  imports: [IconButtonComponent, MessageBeltComponent, MessageBeltComponent],
  templateUrl: './message-menu-belt.component.html',
  styleUrl: './message-menu-belt.component.scss'
})
export class MessageMenuBeltComponent {


  wifiPassword: string = 'wifi-şifresi'; // Replace with your Wi-Fi password
  showModal: boolean = false;
  constructor(private router: Router) { }


  handleClick() {
    this.router.navigate(['menu-page']);
  }

  showWifiPassword() {
    this.showModal = true; // Show the modal
  }
  copyWifiPassword() {
    navigator.clipboard.writeText(this.wifiPassword).then(() => {
      // alert('Wi-Fi password copied to clipboard!');
      this.showModal = false; // Close the modal
    });
  }

  closeModal() {
    this.showModal = false; // Close the modal
  }
}
