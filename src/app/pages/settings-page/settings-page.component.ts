import { Component, OnInit } from '@angular/core';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { CommonModule } from '@angular/common';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { MenuFirebaseRepository } from '../../MenuFeature/infrastructure/menu-firebase.repository';
import { Menu } from '../../MenuFeature/domain/entity/menu.entity';

@Component({
  selector: 'app-settings-page',
  imports: [SettingsSidebarComponent, CommonModule,
    CategoryComponentComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  // selectedSection: string = 'profile';
  selectedSection: string = 'category';

constructor(private menuRepository: MenuFirebaseRepository) {}

  ngOnInit(): void {
    const menuKey = 'menuKey1'; // replace with actual menu key

    // Start listening for changes and log the menu data
    this.menuRepository.listenForMenuChanges(menuKey);

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
