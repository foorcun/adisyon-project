import { Injectable } from '@angular/core';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersPageFacadeService {
  // selectedTable: Table | undefined;

  constructor(private tableServie: TableService) {
    // this.selectedTable = this.tableServie.selectedTable;
  }

  // setSelectedTable(table: Table){
  //   console.log("[AdminOrdersPageFacadeService] selected table.id" + table.id)
  //   this.selectedTable = table;
  // }
}
