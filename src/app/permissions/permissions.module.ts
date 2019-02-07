import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { MatFormFieldModule, MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { PermissionModalComponent } from './components/permission-modal/permission-modal.component';
import { PermissionsTableComponent } from './components/permissions-table/permissions-table.component';





/**
 * Dashboard Dashlet Module
 */
@NgModule({
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    PermissionsRoutingModule,
    SharedModule],
  entryComponents: [
    PermissionsComponent,
    PermissionModalComponent,
    PermissionsTableComponent,
  ],
  declarations: [
    PermissionsComponent,
    PermissionModalComponent,
    PermissionsTableComponent,
  ]
})
export class PermissionsModule { }
