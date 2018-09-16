import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AllTasksPage } from './all-tasks.page';
import { TasksComponent } from '../tasks/tasks.component';
import { GridComponent } from '../grid/grid.component';
import { OnCreateDirective } from '../on-create.directive';
import { GridsterModule } from 'angular-gridster2';
import { TaskGridComponent } from '../task-grid/task-grid.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { FormioModule } from 'angular-formio';
import { MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
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
    GridsterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule, MatInputModule,
    FormioModule
  ],
  entryComponents: [SearchModalComponent, TaskGridComponent, TaskItemComponent, TaskDetailsComponent],
  declarations: [AllTasksPage, TasksComponent, OnCreateDirective, GridComponent, TaskGridComponent,
    TaskItemComponent, SearchModalComponent, TaskDetailsComponent]
})
export class AllTasksPageModule { }
