import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../OrderFeature/domain/entities/order.entity';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Table } from '../../OrderFeature/domain/entities/table.entity';
import { Subscription } from 'rxjs';
import { TableDetailsPageFacadeService } from '../../services/table-details-page.facade.service';
import { OrderStatus } from '../../OrderFeature/domain/entities/order-status';
import { OdemePageArea2Component } from "./odeme-page-area2/odeme-page-area2.component";
import { OdemePageArea3Component } from "./odeme-page-area3/odeme-page-area3.component";
import { OdemePageArea1Component } from "./odeme-page-area1/odeme-page-area1.component";
import { AdminOrdersPageFacadeService } from '../../services/admin-orders-page-facade.service';
import { OdemePageFacadeService } from '../../services/odeme-page-facade.service';
import { OdemePageFacadeService2 } from '../../services/odeme-page-facade2.service';

@Component({
  selector: 'app-odeme-page',
  imports: [CommonModule, OdemePageArea2Component, OdemePageArea3Component, OdemePageArea1Component],
  templateUrl: './odeme-page.component.html',
  styleUrl: './odeme-page.component.scss'
})
export class OdemePageComponent {
  constructor(
    // public odemePageFacadeService: OdemePageFacadeService,
    public odemePageFacadeService: OdemePageFacadeService2,
    public tableDetailsPageFacadeService: TableDetailsPageFacadeService,
  ) {
    this.tableDetailsPageFacadeService.heartBeat();
  }

  goBack(): void {
    window.history.back();
  }

}