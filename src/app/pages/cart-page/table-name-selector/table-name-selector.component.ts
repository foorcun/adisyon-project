import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-name-selector',
  templateUrl: './table-name-selector.component.html',
  styleUrls: ['./table-name-selector.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class TableNameSelectorComponent {
  @Input() tableNames: string[] = []; // List of table names
  @Input() selectedTableName: string = ""; // Initialize with an empty string to avoid null
  @Output() tableNameSelected = new EventEmitter<string>(); // Emits the selected table name

  onTableNameChange(tableName: string): void {
    if (tableName) {
      this.tableNameSelected.emit(tableName);
    }
  }
}
