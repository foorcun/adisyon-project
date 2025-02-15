import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemPageComponent } from './menu-item-page.component';

describe('MenuItemPageComponent', () => {
  let component: MenuItemPageComponent;
  let fixture: ComponentFixture<MenuItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
