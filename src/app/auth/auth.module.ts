import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { FormioAuth, FormioAuthRoutes } from 'angular-formio/auth';
import {
  FormioResourceRoutes
} from 'angular-formio/resource';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AuthIndexComponent } from './auth-index/auth-index.component';
import { FormioModule } from 'angular-formio';
const routes: Routes = [
  {
    path: '',
    component: AuthIndexComponent,
    children: [
      { path: '', component: AuthLoginComponent }
    ]
  }
];
@NgModule({
  imports: [
    FormioModule,
    CommonModule,
    FormioAuth,
    RouterModule.forChild(routes),
    IonicModule,
  ],
  declarations: [AuthLoginComponent, AuthIndexComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class AuthModule { }
