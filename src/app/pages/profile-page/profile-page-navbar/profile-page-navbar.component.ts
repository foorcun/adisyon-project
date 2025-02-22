import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { ProfileModalService } from '../../../services/profile-modal.service';

@Component({
  selector: 'app-profile-page-navbar',
  imports: [CommonModule],
  templateUrl: './profile-page-navbar.component.html',
  styleUrl: './profile-page-navbar.component.scss'
})
export class ProfilePageNavbarComponent {

  constructor(
    // private profileModalService: ProfileModalService
    private router: Router
  ) {}

  closeProfileModal() {
  //   this.profileModalService.closeModal();
this.router.navigate(['/']);
  }
}
