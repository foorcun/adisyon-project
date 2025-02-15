import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-sidebar',
  imports: [],
  templateUrl: './settings-sidebar.component.html',
  styleUrl: './settings-sidebar.component.scss'
})
export class SettingsSidebarComponent {
  @Output() sectionSelected = new EventEmitter<string>();

  selectSection(section: string) {
    this.sectionSelected.emit(section);
  }
}
