import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAreaMobileComponent } from './cart-area-mobile.component';

describe('CartAreaMobileComponent', () => {
  let component: CartAreaMobileComponent;
  let fixture: ComponentFixture<CartAreaMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartAreaMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartAreaMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
