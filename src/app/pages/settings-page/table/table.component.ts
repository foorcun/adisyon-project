import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../../services/table.service';
import { Table } from '../../../OrderFeature/domain/entities/table.entity';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class TableComponent implements OnInit {
  tables: { [key: string]: Table } = {};

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.tableService.tables$.subscribe(tables => {
      this.tables = tables;
      console.log('Tables:', this.tables);
    });
  }
}
