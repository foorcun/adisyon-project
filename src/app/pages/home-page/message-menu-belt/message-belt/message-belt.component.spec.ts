import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBeltComponent } from './message-belt.component';

describe('MessageBeltComponent', () => {
  let component: MessageBeltComponent;
  let fixture: ComponentFixture<MessageBeltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageBeltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageBeltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
