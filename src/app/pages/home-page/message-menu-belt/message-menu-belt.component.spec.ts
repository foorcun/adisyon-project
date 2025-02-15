import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMenuBeltComponent } from './message-menu-belt.component';

describe('MessageMenuBeltComponent', () => {
  let component: MessageMenuBeltComponent;
  let fixture: ComponentFixture<MessageMenuBeltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageMenuBeltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageMenuBeltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
