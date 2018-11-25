import { NgModule } from '@angular/core';
import { FormioResource, FormioResourceConfig, FormioResources } from 'angular-formio/resource';
import { FormComponent } from './components/form/form.component';
import { AppFormioComponent } from './components/formio/formio.component';
import { FormioAuthService } from 'angular-formio/auth';
import { FormioModule } from 'angular-formio';
import { formioAuthConfigProvider, FormioAppConfigProvider } from '../core/services/env.service.provider';
import { SharedModule } from '../shared/shared.module';
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
    FormioAppConfigProvider,
    {
      provide: FormioResourceConfig,
      useValue: {
        name: 'servicerequest',
        form: 'task',
        parents: [
          {
            field: 'user',
            resource: 'currentUser',
            filter: false
          }
        ]
      }
    }
  ]
})

export class FormModule { }
