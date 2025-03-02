import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityBeltComponent } from './quantity-belt-mobile.component';

describe('QuantityBeltComponent', () => {
  let component: QuantityBeltComponent;
  let fixture: ComponentFixture<QuantityBeltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityBeltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityBeltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
