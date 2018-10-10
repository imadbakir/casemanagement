import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth.guard';
import { AllTasksPageModule } from './all-tasks/all-tasks.module';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  { path: 'tasks', loadChildren: () => AllTasksPageModule, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () => AuthModule
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
