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
  tables: Table[] = []; // ✅ Change from object to array


  newTableName = '';
  newTableCapacity = 4;

  editingTableId: string | null = null;
  editedTable: Partial<Table> = {};

  isAddingTable = false;

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    this.tableService.tables$.subscribe(tables => {
      if (!tables || Object.keys(tables).length === 0) {
        this.tables = []; // ✅ Ensure an empty array instead of undefined
        return;
      }

      // Convert object to sorted array
      this.tables = Object.values(tables).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );

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


  /** ✅ Delete a table */
  deleteTable(tableId: string) {
    if (confirm('Are you sure you want to delete this table?')) {
      this.tableService.deleteTable(tableId).subscribe(() => {
        console.log(`Table ${tableId} deleted`);
      });
    }
  }


  openAddTableForm(): void {
    this.isAddingTable = true;
  }

  cancelAddTable(): void {
    this.isAddingTable = false;
    this.newTableName = '';
    this.newTableCapacity = 4;
  }

  onAddTableSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.newTableName.trim() || this.newTableCapacity <= 0) return;

    this.createTable();
    this.cancelAddTable();
  }

}

