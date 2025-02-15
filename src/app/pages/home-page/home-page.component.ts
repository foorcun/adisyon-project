import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageMenuBeltComponent } from './message-menu-belt/message-menu-belt.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { NavbarBootstrapComponent } from '../../common/navbar-bootstrap/navbar-bootstrap.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,HeroSectionComponent, MessageMenuBeltComponent, NavbarBootstrapComponent ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
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
