import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityButtonGroupComponent } from './quantity-button-group.component';

describe('QuantityButtonGroupComponent', () => {
  let component: QuantityButtonGroupComponent;
  let fixture: ComponentFixture<QuantityButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityButtonGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
