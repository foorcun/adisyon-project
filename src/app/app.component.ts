import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarBootstrapComponent } from './common/navbar-bootstrap/navbar-bootstrap.component';
import { BottomNavigationBarComponent } from './common/bottom-navigation-bar/bottom-navigation-bar.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavigationBarComponent, CommonModule ],
  // imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
 title = 'adisyon-project';
  showBottomNav = true;

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkRoute();
    });
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    const tableDetailsPattern = /^\/table-details\/[a-zA-Z0-9_-]+$/;

    this.showBottomNav = !tableDetailsPattern.test(currentUrl);
  }
}
