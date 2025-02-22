import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageContentInProgressComponent } from './order-page-content-in-progress.component';

describe('OrderPageContentBacklogComponent', () => {
  let component: OrderPageContentInProgressComponent;
  let fixture: ComponentFixture<OrderPageContentInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageContentInProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPageContentInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
