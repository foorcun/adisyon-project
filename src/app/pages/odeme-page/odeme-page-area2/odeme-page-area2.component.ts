import { Component } from '@angular/core';
import { OdemePageFacadeService } from '../../../services/odeme-page-facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-odeme-page-area2',
  imports: [CommonModule],
  templateUrl: './odeme-page-area2.component.html',
  styleUrl: './odeme-page-area2.component.scss'
})
export class OdemePageArea2Component {

  constructor(public odemePageFacadeService: OdemePageFacadeService) { }
}
