import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { TasksModule } from '../tasks/tasks.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  { path: 'tasks', loadChildren: '../tasks/tasks.module#TasksModule', canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: '../auth/auth.module#AuthModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
