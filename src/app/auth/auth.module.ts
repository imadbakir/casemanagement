import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
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
    FormioAuth,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AuthLoginComponent, AuthIndexComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class AuthModule { }
