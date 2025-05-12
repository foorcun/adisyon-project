import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';

@Component({
  selector: 'app-odeme-page-area1',
  imports: [CommonModule],
  templateUrl: './odeme-page-area1.component.html',
  styleUrl: './odeme-page-area1.component.scss'
})
export class OdemePageArea1Component {

  constructor(
    public odemePageFacadeService: OdemePageFacadeService
  ) {
  }

  onItemClick(item: any): void {
    console.log('Clicked:', item);
  }

}
