import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CustomerResourceComponent } from './customer-resource.component';

describe('CustomerResourceComponent', () => {
  let component: CustomerResourceComponent;
  let fixture: ComponentFixture<CustomerResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
