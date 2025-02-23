import { Component, OnInit } from '@angular/core';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { CommonModule } from '@angular/common';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';
import { Menu } from '../../MenuFeature/domain/entity/menu.entity';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { NavbarBootstrapComponent } from '../../common/navbar-bootstrap/navbar-bootstrap.component';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-settings-page',
  imports: [SettingsSidebarComponent, CommonModule,
    CategoryComponentComponent,
    MenuItemComponent,
    NavbarBootstrapComponent,
    TableComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  // selectedSection: string = 'profile';
  selectedSection: string = 'menu-item';

  constructor(private menuRepository: MenuFirebaseRepository) { }

  ngOnInit(): void {

    // Start listening for changes and log the menu data
    this.menuRepository.listenForMenuChanges();

    // Subscribe to the observable to log data
    this.menuRepository.menu$.subscribe((menu: Menu | null) => {
      if (menu) {
        console.log('Menu Data:', menu);
      } else {
        console.log('No menu data available.');
      }
    });
  }

  onSectionChange(section: string) {
    this.selectedSection = section;
  }

}
