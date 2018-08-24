import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AllTasksPage } from './all-tasks.page';
import { TasksComponent } from '../tasks/tasks.component';
import { OnCreateDirective } from '../on-create.directive';
const routes: Routes = [
  {
    path: '',
    component: AllTasksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AllTasksPage, TasksComponent, OnCreateDirective]
})
export class AllTasksPageModule { }
