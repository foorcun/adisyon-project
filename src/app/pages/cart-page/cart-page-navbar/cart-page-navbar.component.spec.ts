import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPageNavbarComponent } from './cart-page-navbar.component';

describe('CartPageNavbarComponent', () => {
  let component: CartPageNavbarComponent;
  let fixture: ComponentFixture<CartPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
