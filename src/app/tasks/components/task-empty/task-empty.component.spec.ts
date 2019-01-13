import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEmptyComponent } from './task-empty.component';

describe('TaskEditComponent', () => {
  let component: TaskEmptyComponent;
  let fixture: ComponentFixture<TaskEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
