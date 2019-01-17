import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from './components/chart/chart.component';





/**
 * Tasks Dashlet Module
 */
@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule],
  declarations: [
    DashboardComponent,
    ChartComponent
  ]
})
export class DashboardModule { }
