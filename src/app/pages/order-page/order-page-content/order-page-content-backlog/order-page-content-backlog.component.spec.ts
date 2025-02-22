import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageContentBacklogComponent } from './order-page-content-backlog.component';

describe('OrderPageContentBacklogComponent', () => {
  let component: OrderPageContentBacklogComponent;
  let fixture: ComponentFixture<OrderPageContentBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageContentBacklogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPageContentBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
