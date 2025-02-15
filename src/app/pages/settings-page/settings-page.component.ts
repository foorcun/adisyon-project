import { Component } from '@angular/core';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  imports: [SettingsSidebarComponent, CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
selectedSection: string = 'profile';

  onSectionChange(section: string) {
    this.selectedSection = section;
  }

}
