import { Injectable } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private breadcrumbService: BreadcrumbService) {}

  log(message: string): void {
    const breadcrumbId = this.breadcrumbService.getBreadcrumbId();
    console.log(`[breadcrumb=${breadcrumbId ?? 'none'}] ${message}`);
  }

  error(message: string, error?: any): void {
    const breadcrumbId = this.breadcrumbService.getBreadcrumbId();
    console.error(`[breadcrumb=${breadcrumbId ?? 'none'}] ${message}`, error);
  }

  info(message: string): void {
    const breadcrumbId = this.breadcrumbService.getBreadcrumbId();
    console.info(`[breadcrumb=${breadcrumbId ?? 'none'}] ${message}`);
  }
}
