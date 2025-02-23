import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHomePageComponent } from './test-home-page.component';

describe('TestHomePageComponent', () => {
  let component: TestHomePageComponent;
  let fixture: ComponentFixture<TestHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
