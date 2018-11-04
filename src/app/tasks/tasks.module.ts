import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDatepickerModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormioModule } from 'angular-formio';
import { FormioResource, FormioResourceConfig } from 'angular-formio/resource';
import { GridsterModule } from 'angular-gridster2';
import { FormComponent } from '../core/components/form/form.component';
import { AppFormioComponent } from '../core/components/formio/formio.component';
import { OnCreateDirective } from '../core/directives/on-create.directive';
import { SharedModule } from '../shared/shared.module';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { GridComponent } from './components/grid/grid.component';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { TaskGridComponent } from './components/task-grid/task-grid.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TasksComponent } from './tasks.component';




const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      { path: 'edit/:taskId', component: TaskEditComponent },
      { path: 'new/:processDefinitionId', component: ProcessFormComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GridsterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule, MatInputModule,
    FormioModule,
    FormioResource,
    RouterModule.forChild(routes),
    SharedModule
  ],
  entryComponents: [ProcessFormComponent, FilterOptionsComponent, ProcessListComponent, FilterModalComponent,
    AppFormioComponent, FormComponent, TaskGridComponent, TaskItemComponent, TaskDetailsComponent,
    TaskEditComponent],
  declarations: [ProcessFormComponent, FilterOptionsComponent, ProcessListComponent, FilterModalComponent,
    AppFormioComponent, FormComponent, TaskEditComponent, TasksComponent, OnCreateDirective, GridComponent, TaskGridComponent,
    TaskItemComponent, TaskDetailsComponent],
  providers: [
    {
      provide: FormioResourceConfig,
      useValue: {
        name: 'servicerequest',
        form: 'task',
        parents: [
          {
            field: 'user',
            resource: 'currentUser',
            filter: false
          }
        ]
      }
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class TasksModule { }
