import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../../services/table.service';
import { Table } from '../../../OrderFeature/domain/entities/table.entity';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TableComponent implements OnInit {
  tables: { [key: string]: Table } = {};

  newTableName = '';
  newTableCapacity = 4;

  editingTableId: string | null = null;
  editedTable: Partial<Table> = {};

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    this.tableService.tables$.subscribe(tables => {
      this.tables = tables;
      console.log('Tables:', this.tables);
    });
  }

  createTable() {
    if (!this.newTableName.trim()) return;

    const newTable: Table = new Table(
      `table_${Date.now()}`, // Unique ID
      this.newTableName,
      this.newTableCapacity,
      'available',
      {} // Empty orders
    );

    this.tableService.createTable(newTable).subscribe(() => {
      console.log('Table Created:', newTable);
      this.newTableName = '';
      this.newTableCapacity = 4;
    });
  }

  startEditing(table: Table) {
    this.editingTableId = table.id;
    this.editedTable = { ...table }; // Clone table for editing
  }

  updateTable() {
    if (this.editingTableId) {
      this.tableService.updateTable(this.editingTableId, this.editedTable).subscribe(() => {
        console.log('Table updated:', this.editedTable);
        this.editingTableId = null; // Close edit mode
      });
    }
  }
}
