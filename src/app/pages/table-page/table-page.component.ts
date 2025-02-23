import { Component, OnInit } from '@angular/core';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class TablePageComponent implements OnInit {
  tables: { [key: string]: Table } = {};

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.tableService.tables$.subscribe(tables => {
      this.tables = tables;
      console.log('Tables:', this.tables);
    });
  }
}
