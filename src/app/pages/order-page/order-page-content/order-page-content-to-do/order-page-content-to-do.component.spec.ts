import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageContentToDoComponent } from './order-page-content-to-do.component';

describe('OrderPageContentBacklogComponent', () => {
  let component: OrderPageContentToDoComponent;
  let fixture: ComponentFixture<OrderPageContentToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageContentToDoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPageContentToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
