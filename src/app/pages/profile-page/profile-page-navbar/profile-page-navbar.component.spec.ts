import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageNavbarComponent } from './profile-page-navbar.component';

describe('ProfilePageNavbarComponent', () => {
  let component: ProfilePageNavbarComponent;
  let fixture: ComponentFixture<ProfilePageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
