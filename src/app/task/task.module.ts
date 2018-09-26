import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { FormioModule } from 'angular-formio';
import {
  FormioResource,
  FormioResourceRoutes,
  FormioResourceConfig,
  FormioResourceService,
} from 'angular-formio/resource';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskResourceComponent } from './task-resource/task-resource.component';
import { TaskIndexComponent } from './task-index/task-index.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { KeysPipe } from '../keys.pipe';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../events.service';
const taskResourceRoutes: Routes = FormioResourceRoutes({
  create: TaskCreateComponent,
  edit: TaskEditComponent,
  view: TaskViewComponent,
  resource: TaskResourceComponent,
  index: TaskIndexComponent

});

/* taskResourceRoutes[2].children.push({
  path: 'forms',
  loadChildren: () => FormioFormsModule
});*/



@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    FormioResource,
    FormsModule,
    RouterModule.forChild(taskResourceRoutes),
    IonicModule,

  ],
  exports: [KeysPipe],
  declarations: [KeysPipe, TaskEditComponent, TaskCreateComponent, TaskResourceComponent, TaskViewComponent, TaskIndexComponent],
  providers: [
    FormioResourceService,
    {
      provide: FormioResourceConfig,
      useValue: {
        name: 'task',
        form: 'task'
      }
    }
    ,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class TaskModule { }
