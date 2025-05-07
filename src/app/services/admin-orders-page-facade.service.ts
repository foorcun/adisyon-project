import { Injectable } from '@angular/core';
import { Table } from '../OrderFeature/domain/entities/table.entity';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersPageFacadeService {
  selectedTable: Table | undefined ;

  constructor() { }

  setSelectedTable(table: Table){
    console.log("[AdminOrdersPageFacadeService] selected table.id" + table.id)
    this.selectedTable = table;
  }
}
