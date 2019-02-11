import { NgModule } from '@angular/core';
import { MatAutocompleteModule, MatDatepickerModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { GridsterModule } from 'angular-gridster2';
import { FormModule } from '../form/form.module';
import { SharedModule } from '../shared/shared.module';
import { AddRequestButtonComponent } from './components/add-request-button/add-request-button.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { GridsterComponent } from './components/gridster/gridster.component';
import { SortOptionsComponent } from './components/sort-options/sort-options.component';
import { CaseDetailsComponent } from './components/case-details/case-details.component';
import { CaseEditComponent } from './components/case-edit/case-edit.component';
import { CaseGridComponent } from './components/case-grid/case-grid.component';
import { CaseItemComponent } from './components/case-item/case-item.component';
import { CasesRoutingModule } from './cases-routing.module';
import { CasesComponent } from './cases.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CaseEmptyComponent } from './components/case-empty/case-empty.component';
import { CaseFilterComponent } from './components/case-filter/case-filter.component';




/**
 * Cases Dashlet Module
 */
@NgModule({
  imports: [
    CasesRoutingModule,
    GridsterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule, MatInputModule,
    SharedModule,
    FormModule,
    ScrollingModule
  ],
  entryComponents: [FilterModalComponent, SortOptionsComponent, CaseFilterComponent],
  declarations: [
    FilterModalComponent,
    CaseEditComponent,
    CaseEmptyComponent,
    CasesComponent,
    GridsterComponent,
    CaseGridComponent,
    CaseItemComponent,
    CaseDetailsComponent,
    SortOptionsComponent,
    CaseFilterComponent,
    AddRequestButtonComponent]
})
export class CasesModule { }
