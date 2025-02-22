import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageContentComponent } from './order-page-content.component';

describe('OrderPageContentComponent', () => {
  let component: OrderPageContentComponent;
  let fixture: ComponentFixture<OrderPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
