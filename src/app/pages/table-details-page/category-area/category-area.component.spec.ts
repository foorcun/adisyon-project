import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAreaComponent } from './category-area.component';

describe('CategoryAreaComponent', () => {
  let component: CategoryAreaComponent;
  let fixture: ComponentFixture<CategoryAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
