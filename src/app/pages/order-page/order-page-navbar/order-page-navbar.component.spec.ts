import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageNavbarComponent } from './order-page-navbar.component';

describe('OrderPageNavbarComponent', () => {
  let component: OrderPageNavbarComponent;
  let fixture: ComponentFixture<OrderPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
