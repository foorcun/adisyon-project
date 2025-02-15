import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloFirebaseComponent } from './hello-firebase.component';

describe('HelloFirebaseComponent', () => {
  let component: HelloFirebaseComponent;
  let fixture: ComponentFixture<HelloFirebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloFirebaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelloFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
