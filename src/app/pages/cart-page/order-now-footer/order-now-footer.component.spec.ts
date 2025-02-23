import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNowFooterComponent } from './order-now-footer.component';

describe('OrderNowFooterComponent', () => {
  let component: OrderNowFooterComponent;
  let fixture: ComponentFixture<OrderNowFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderNowFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderNowFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
