import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '../../../common/icon-button/icon-button.component';

@Component({
  selector: 'app-hero-section',
  imports: [IconButtonComponent,CommonModule ],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {

  wifiPassword: string = 'wifi-şifresi'; // Replace with your Wi-Fi password
  showModal: boolean = false;


  constructor(
    private router: Router,
  ) { }

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

