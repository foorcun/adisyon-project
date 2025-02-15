import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPageComponent } from './menu-page.component';

xdescribe('MenuPageComponent', () => {
  let component: MenuPageComponent;
  let fixture: ComponentFixture<MenuPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
