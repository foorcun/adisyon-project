import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNameSelectorComponent } from './table-name-selector.component';

describe('TableNameSelectorComponent', () => {
  let component: TableNameSelectorComponent;
  let fixture: ComponentFixture<TableNameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableNameSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableNameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
