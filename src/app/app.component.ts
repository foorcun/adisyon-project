import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarBootstrapComponent } from './common/navbar-bootstrap/navbar-bootstrap.component';
import { BottomNavigationBarComponent } from './common/bottom-navigation-bar/bottom-navigation-bar.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { MyConfigService } from './services/my-config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavigationBarComponent, CommonModule],
  // imports: [RouterOutlet, CommonModule ],
  // imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  title = 'adisyon-project';
  showBottomNav = true;
  isUserAllowed = false;

  constructor(private router: Router, private userService: UserService, private myConfig: MyConfigService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkRoute();
    });
    // this.isUserAllowed = this.userService.currentUserWithRole$.
    this.userService.currentUserWithRole$.subscribe(currentuserWithRole => {
      // console.log(currentuserWithRole)
      if (currentuserWithRole) {
        this.isUserAllowed = !currentuserWithRole.isUser();
      }
    })


    // document.documentElement.style.setProperty('--primary-color', this.myConfig.primaryColor);
    this.myConfig.config$.subscribe(myConfig => {
      console.log("[AppComponent]" + myConfig.primaryColor)
      document.documentElement.style.setProperty('--primary-color', myConfig.primaryColor);
    }
    )
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    const tableDetailsPattern = /^\/table-details\/[a-zA-Z0-9_-]+$/;

    this.showBottomNav = !tableDetailsPattern.test(currentUrl);
  }
}
