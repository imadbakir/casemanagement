import { NgModule } from '@angular/core';
import { FormioModule } from 'angular-formio';
import { FormioAuthService } from 'angular-formio/auth';
import { FormioResource, FormioResources } from 'angular-formio/resource';
import { FormioAppConfigProvider, formioAuthConfigProvider } from '../core/services/env.service.provider';
import { SharedModule } from '../shared/shared.module';
import { FormComponent } from './components/form/form.component';
import { AppFormioComponent } from './components/formio/formio.component';
@NgModule({
  imports: [SharedModule, FormioModule, FormioResource],
  declarations: [AppFormioComponent, FormComponent],

  exports: [
     AppFormioComponent, FormComponent
  ],
  providers: [

    FormioResources,
    FormioAuthService,
    formioAuthConfigProvider,
    FormioAppConfigProvider
  ]
})

export class FormModule { }
