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
    return this.tablesSubject.getValue();
  }
}
