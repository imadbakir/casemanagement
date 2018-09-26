import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TaskResourceComponent } from './task-resource.component';

describe('TaskResourceComponent', () => {
  let component: TaskResourceComponent;
  let fixture: ComponentFixture<TaskResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
