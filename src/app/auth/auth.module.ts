import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthIndexComponent } from './components/auth-index/auth-index.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';



const routes: Routes = [
  {
    path: '',
    component: AuthIndexComponent,
    children: [
      { path: '', redirectTo: 'login' },
      { path: 'login', component: AuthLoginComponent }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AuthLoginComponent, AuthIndexComponent]
})
export class AuthModule { }
