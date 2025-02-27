import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemePageComponent } from './odeme-page.component';

describe('OdemePageComponent', () => {
  let component: OdemePageComponent;
  let fixture: ComponentFixture<OdemePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
