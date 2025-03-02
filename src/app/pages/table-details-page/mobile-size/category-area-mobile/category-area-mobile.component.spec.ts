import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAreaMobileComponent } from './category-area-mobile.component';

describe('CategoryAreaMobileComponent', () => {
  let component: CategoryAreaMobileComponent;
  let fixture: ComponentFixture<CategoryAreaMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAreaMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAreaMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
