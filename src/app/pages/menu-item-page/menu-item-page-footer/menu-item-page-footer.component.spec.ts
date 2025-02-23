import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemPageFooterComponent } from './menu-item-page-footer.component';

describe('MenuItemPageFooterComponent', () => {
  let component: MenuItemPageFooterComponent;
  let fixture: ComponentFixture<MenuItemPageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemPageFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
