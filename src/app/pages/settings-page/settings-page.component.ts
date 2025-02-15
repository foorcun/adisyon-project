import { Component } from '@angular/core';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { CommonModule } from '@angular/common';
import { CategoryComponentComponent } from './category-component/category-component.component';

@Component({
  selector: 'app-settings-page',
  imports: [SettingsSidebarComponent, CommonModule,
    CategoryComponentComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  // selectedSection: string = 'profile';
  selectedSection: string = 'category';

  onSectionChange(section: string) {
    this.selectedSection = section;
  }

}
