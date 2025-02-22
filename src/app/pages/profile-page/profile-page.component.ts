import { Component } from '@angular/core';
import { ProfilePageNavbarComponent } from './profile-page-navbar/profile-page-navbar.component';
import { UserService } from '../../services/user.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfilePageNavbarComponent, CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent {
  error = '';
  userWithRole?: UserWithRole | null;

  constructor(private userService: UserService) {
    this.userService.currentUserWithRole$.subscribe((userWithRole) => {
      this.userWithRole = userWithRole;
      console.log('UserWithRole updated:', userWithRole);
    });
  }

  async onGoogleSignIn() {
    try {
      await this.userService.signInWithGoogle();
      alert('Google Sign-In successful!');
    } catch (err: any) {
      this.error = err.message;
      console.error('Google Sign-In error:', err);
    }
  }

  logout() {
    this.userService.logout();
  }

  handleAdminAction() {
    console.log('Admin action triggered');
    alert('Admin action triggered');
  }

  handleUserAction() {
    console.log('User action triggered');
    alert('User action triggered');
  }
}

