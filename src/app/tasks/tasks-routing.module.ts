import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { TasksComponent } from './tasks.component';
import { HistoryTaskComponent } from './components/history-task/history-task.component';
import { GridsterComponent } from './components/gridster/gridster.component';
import { TaskEmptyComponent } from './components/task-empty/task-empty.component';
import { FiltersMenuComponent } from './components/filters-menu/filters-menu.component';
import { TasksMenuComponent } from './components/tasks-menu/tasks-menu.component';

/**
 * Tasks  Routing Module
 */
const routes: Routes = [
  {
    path: '', component: TasksComponent,
    children: [
      { path: 'new/:processDefinitionId', component: ProcessFormComponent },
      {
        path: ':filterId', component: GridsterComponent,
        children: [
          {
            path: 'edit/:taskId', component: TaskEditComponent,
          },
          {
            path: 'view/:taskId', component: HistoryTaskComponent,
          },
          {
            path: '', component: TaskEmptyComponent,
          }
        ]
      }
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
