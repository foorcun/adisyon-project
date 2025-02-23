import { Component, OnInit } from '@angular/core';
import { TableFirebaseRepository } from '../../OrderFeature/infrastructure/repositories/table-firebase.repository';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class TablePageComponent implements OnInit {
  tables: { [key: string]: Table } = {};

  constructor(private tableRepository: TableFirebaseRepository) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables() {
    this.tableRepository.listenForTablesChanges();
    this.tableRepository.tables$.subscribe(tables => {
      if (tables) {
        this.tables = tables;
        console.log('Tables:', this.tables);
      }
    });
  }

  // Add a sample order to Table 1
  // addOrderToTable1() {
  //   const newOrder: Order = {
  //     id: 'order3',
  //     items: {
  //       item1: {
  //         name: 'Spaghetti',
  //         price: 10,
  //         productId: 'pasta1',
  //         quantity: 1,
  //       },
  //     },
  //     status: 'pending',
  //     totalPrice: 10,
  //   };

  //   this.tableRepository.addOrder('table1', newOrder).subscribe(() => {
  //     console.log('Order added to Table 1');
  //   });
  // }

  // Mark an order as completed
  // completeOrder(tableId: string, orderId: string) {
  //   this.tableRepository.updateOrder(tableId, orderId, { status: 'completed' }).subscribe(() => {
  //     console.log(`Order ${orderId} marked as completed`);
  //   });
  // }
}
