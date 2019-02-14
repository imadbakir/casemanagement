import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from './components/chart/chart.component';
import { CasesModule } from '../cases/cases.module';





/**
 * Dashboard Dashlet Module
 */
@NgModule({
  imports: [
    DashboardRoutingModule,
    CasesModule,
    SharedModule],
  declarations: [
    DashboardComponent,
    ChartComponent,
  ]
})
export class DashboardModule { }
