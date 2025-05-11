import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpaymentComponent } from './subpayment.component';

describe('SubpaymentComponent', () => {
  let component: SubpaymentComponent;
  let fixture: ComponentFixture<SubpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
