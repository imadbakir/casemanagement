import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortOptionsComponent } from './sort-options.component';

describe('SortOptionsComponent', () => {
  let component: SortOptionsComponent;
  let fixture: ComponentFixture<SortOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
