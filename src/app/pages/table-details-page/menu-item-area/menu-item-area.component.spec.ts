import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemAreaComponent } from './menu-item-area.component';

describe('MenuItemAreaComponent', () => {
  let component: MenuItemAreaComponent;
  let fixture: ComponentFixture<MenuItemAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
