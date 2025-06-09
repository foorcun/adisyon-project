import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserWithRole } from '../../UserFeature/domain/entities/user-with-role';
import { UserRole } from '../../UserFeature/domain/entities/user-role.entity';
import { CommonModule } from '@angular/common';
import { Role } from '../../UserFeature/domain/entities/role.enum';

@Component({
  selector: 'app-navbar-bootstrap',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-bootstrap.component.html',
  styleUrl: './navbar-bootstrap.component.scss',
})
export class NavbarBootstrapComponent {
  isNavbarCollapsed = true;

  currentUserWithRole: UserWithRole | null = null;

  constructor(
    private renderer: Renderer2,
    private userService: UserService
  ) {
    this.userService.currentUserWithRole$.subscribe(user => {
      this.currentUserWithRole = user;
    });
  }

  get isAdmin(): boolean {
    // return this.currentUserWithRole?.role === Role.ADMIN;
    return this.currentUserWithRole?.isAdmin() || false;
  }
  toggleNavbar(): void {
    const navbar = document.querySelector('.navbar-collapse');
    if (navbar) {
      this.isNavbarCollapsed = !this.isNavbarCollapsed;
      if (this.isNavbarCollapsed) {
        this.renderer.removeClass(navbar, 'show');
      } else {
        this.renderer.addClass(navbar, 'show');
      }
    }
  }
  closeNavbar(): void {
    const navbar = document.querySelector('.navbar-collapse');

    if (navbar && navbar.classList.contains('show')) {
      this.renderer.removeClass(navbar, 'show');
      this.isNavbarCollapsed = true;
    }
  }
}
