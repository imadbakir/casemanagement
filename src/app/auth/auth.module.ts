import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormioModule } from 'angular-formio';
import { FormioAuth } from 'angular-formio/auth';
import { SharedModule } from '../shared/shared.module';
import { AuthIndexComponent } from './components/auth-index/auth-index.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';



const routes: Routes = [
  {
    path: '',
    component: AuthIndexComponent,
    children: [
      { path: 'login', component: AuthLoginComponent }
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
    FormsModule,
    SharedModule
  ],
  declarations: [AuthLoginComponent, AuthIndexComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class AuthModule { }
