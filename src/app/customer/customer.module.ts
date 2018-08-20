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
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerResourceComponent } from './customer-resource/customer-resource.component';
import { CustomerIndexComponent } from './customer-index/customer-index.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { KeysPipe } from '../keys.pipe';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../events.service';
const customerResourceRoutes: Routes = FormioResourceRoutes({
  create: CustomerCreateComponent,
  view: CustomerViewComponent,
  resource: CustomerResourceComponent,
  index: CustomerIndexComponent

});

/* customerResourceRoutes[2].children.push({
  path: 'forms',
  loadChildren: () => FormioFormsModule
});*/



@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    FormioResource,
    FormsModule,
    RouterModule.forChild(customerResourceRoutes),
    IonicModule,

  ],
  exports: [KeysPipe],
  declarations: [KeysPipe, CustomerCreateComponent, CustomerResourceComponent, CustomerViewComponent, CustomerIndexComponent],
  providers: [
    FormioResourceService,
    {
      provide: FormioResourceConfig,
      useValue: {
        name: 'customer',
        form: 'customer',
        parents: ['dealer']
      }
    }
    ,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ]
})
export class CustomerModule { }
