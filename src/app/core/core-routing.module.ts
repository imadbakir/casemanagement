import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MenuComponent } from './components/menu/menu.component';

/**
 * App Main Routing Module
 */
const routes: Routes = [

  // App routes goes here here
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks',
        loadChildren:
          '../tasks/tasks.module#TasksModule',
        canActivate: [AuthGuard]
      }
    ]
  },

  // no layout routes
  {
    path: 'auth',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
