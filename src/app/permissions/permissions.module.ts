import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { MatFormFieldModule, MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { PermissionModalComponent } from './components/permission-modal/permission-modal.component';





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
  entryComponents: [PermissionModalComponent],
  declarations: [
    PermissionsComponent,
    PermissionModalComponent]
})
export class PermissionsModule { }
