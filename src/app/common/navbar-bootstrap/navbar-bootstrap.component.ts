import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-bootstrap',
  imports: [RouterModule],
  templateUrl: './navbar-bootstrap.component.html',
  styleUrl: './navbar-bootstrap.component.scss'
})
export class NavbarBootstrapComponent {
  isNavbarCollapsed = true;
  constructor(private renderer: Renderer2) { }

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
