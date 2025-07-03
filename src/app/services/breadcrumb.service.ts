import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private currentBreadcrumbId: string | null = null;

  startBreadcrumb(): string {
    this.currentBreadcrumbId = uuidv4();
    return this.currentBreadcrumbId;
  }

  getBreadcrumbId(): string | null {
    return this.currentBreadcrumbId;
  }

  clearBreadcrumb(): void {
    this.currentBreadcrumbId = null;
  }
}
