import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Table } from '../OrderFeature/domain/entities/table.entity';
import { TableFirebaseRepository } from '../OrderFeature/infrastructure/repositories/table-firebase.repository';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tablesSubject = new BehaviorSubject<{ [key: string]: Table }>({});
  tables$ = this.tablesSubject.asObservable();

  constructor(private tableRepository: TableFirebaseRepository) {
    this.listenForTablesChanges(); // 🔥 Listen immediately when the service is initialized
  }

  private listenForTablesChanges(): void {
    this.tableRepository.listenForTablesChanges();
    this.tableRepository.tables$.subscribe(tables => {
      if (tables) {
        this.tablesSubject.next(tables);
      }
    });
  }

  getTables(): { [key: string]: Table } {
    // return this.tablesSubject.getValue();
    const tables = this.tablesSubject.getValue();

    // Convert to array, sort by name using natural sorting, then back to an object
    const sortedTablesArray = Object.entries(tables)
      .sort(([, a], [, b]) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .reduce((acc, [key, table]) => {
        acc[key] = table;
        return acc;
      }, {} as { [key: string]: Table });

    return sortedTablesArray;
  }



  // ✅ Expose Create Table Function
  createTable(table: Table): Observable<void> {
    return this.tableRepository.createTable(table);
  }
  updateTable(tableId: string, updates: Partial<Table>): Observable<void> {
    return this.tableRepository.updateTable(tableId, updates);
  }


  /** ✅ Delete a table */
  deleteTable(tableId: string): Observable<void> {
    return this.tableRepository.deleteTable(tableId);
  }

  getTableNameforUUID(tableId: string): string | undefined {
    const tables = this.tablesSubject.getValue();
    return tables[tableId]?.name;
  }
}
