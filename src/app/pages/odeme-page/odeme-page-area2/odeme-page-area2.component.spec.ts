import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemePageArea2Component } from './odeme-page-area2.component';

describe('OdemePageArea2Component', () => {
  let component: OdemePageArea2Component;
  let fixture: ComponentFixture<OdemePageArea2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemePageArea2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemePageArea2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
