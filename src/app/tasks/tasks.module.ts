import { NgModule } from '@angular/core';
import { MatAutocompleteModule, MatDatepickerModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { GridsterModule } from 'angular-gridster2';
import { OnCreateDirective } from '../core/directives/on-create.directive';
import { FormModule } from '../form/form.module';
import { SharedModule } from '../shared/shared.module';
import { AddRequestButtonComponent } from './components/add-request-button/add-request-button.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { FiltersMenuComponent } from './components/filters-menu/filters-menu.component';
import { GridComponent } from './components/grid/grid.component';
import { GridsterComponent } from './components/gridster/gridster.component';
import { HistoryTaskComponent } from './components/history-task/history-task.component';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { SortOptionsComponent } from './components/sort-options/sort-options.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { TaskGridComponent } from './components/task-grid/task-grid.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';





/**
 * Tasks Dashlet Module
 */
@NgModule({
  imports: [
    TasksRoutingModule,
    GridsterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule, MatInputModule,
    SharedModule,
    FormModule
  ],
  entryComponents: [FilterOptionsComponent, ProcessListComponent, FilterModalComponent, SortOptionsComponent],
  declarations: [
    HistoryTaskComponent,
    ProcessFormComponent,
    FilterOptionsComponent,
    ProcessListComponent,
    FilterModalComponent,
    TaskEditComponent,
    TasksComponent,
    OnCreateDirective,
    GridsterComponent,
    GridComponent,
    FiltersMenuComponent,
    TaskGridComponent,
    TaskItemComponent,
    TaskDetailsComponent,
    SortOptionsComponent,
    AddRequestButtonComponent]
})
export class TasksModule { }
