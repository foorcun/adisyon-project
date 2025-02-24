import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';

@Component({
  selector: 'app-table-details-page',
  templateUrl: './table-details-page.component.html',
  styleUrls: ['./table-details-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TableDetailsPageComponent implements OnInit {
  table: Table | null = null;

  constructor(private route: ActivatedRoute, private tableService: TableService) {}

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('id');
    console.log("[TableDetailsPageComponent] tableId:", tableId);
    if (tableId) {
      this.table = this.tableService.getTables()[tableId] || null;
    }
  }
}
