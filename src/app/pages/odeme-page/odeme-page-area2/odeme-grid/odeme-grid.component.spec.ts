import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemeGridComponent } from './odeme-grid.component';

describe('OdemeGridComponent', () => {
  let component: OdemeGridComponent;
  let fixture: ComponentFixture<OdemeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemeGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
