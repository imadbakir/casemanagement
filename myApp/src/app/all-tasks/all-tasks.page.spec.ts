import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTasksPage } from './all-tasks.page';

describe('AllTasksPage', () => {
  let component: AllTasksPage;
  let fixture: ComponentFixture<AllTasksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTasksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
