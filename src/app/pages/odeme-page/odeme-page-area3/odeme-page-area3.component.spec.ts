import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemePageArea3Component } from './odeme-page-area3.component';

describe('OdemePageArea3Component', () => {
  let component: OdemePageArea3Component;
  let fixture: ComponentFixture<OdemePageArea3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemePageArea3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemePageArea3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
