import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasesComponent } from './cases.component';
import { GridsterComponent } from './components/gridster/gridster.component';
import { CaseEditComponent } from './components/case-edit/case-edit.component';
import { CaseEmptyComponent } from './components/case-empty/case-empty.component';
import { CaseFilterComponent } from './components/case-filter/case-filter.component';

/**
 * Tasks  Routing Module
 */
const routes: Routes = [
  {
    path: '', component: CasesComponent,
    children: [
      {
        path: '', component: GridsterComponent,
        children: [
          {
            path: 'edit/:taskId', component: CaseEditComponent,
          },
          {
            path: '', component: CaseEmptyComponent,
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
export class CasesRoutingModule { }
