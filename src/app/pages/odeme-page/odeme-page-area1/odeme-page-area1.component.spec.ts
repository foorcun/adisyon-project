import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemePageArea1Component } from './odeme-page-area1.component';

describe('OdemePageArea1Component', () => {
  let component: OdemePageArea1Component;
  let fixture: ComponentFixture<OdemePageArea1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemePageArea1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemePageArea1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
