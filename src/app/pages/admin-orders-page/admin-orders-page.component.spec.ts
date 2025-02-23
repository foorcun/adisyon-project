import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersPageComponent } from './admin-orders-page.component';

describe('AdminOrdersPageComponent', () => {
  let component: AdminOrdersPageComponent;
  let fixture: ComponentFixture<AdminOrdersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrdersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
