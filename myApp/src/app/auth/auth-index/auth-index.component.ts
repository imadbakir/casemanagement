import { Component, OnInit } from '@angular/core';
import { FormioAuthComponent, FormioAuthService } from 'angular-formio/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-login',
  templateUrl: './auth-index.component.html',
  styleUrls: ['./auth-index.component.scss'],
})
export class AuthIndexComponent extends FormioAuthComponent implements OnInit {
  tsks: any = [];
  filtered: any = [];
  properties: any = ['Name'];
  dataLoaded: Boolean = false;
  filter: any = {
    createdAt: '',
    dueAt: '',
    sortingProp: { name: 'firstName', type: 'string' },
    sortingDirection: -1,
    textSearch: '',
  };
  route;

  tasksOrigin: any = [];

  constructor(public service: FormioAuthService, public _route: Router) {
    super();
    this.route = _route;
  }
  ngOnInit() {
    console.log(this.route.url);

  }
}
