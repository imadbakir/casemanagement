import { FormioAppConfig, FormioLoader } from 'angular-formio';
import { FormioResourceConfig, FormioResources } from 'angular-formio/resource';
import { FormioResourceService } from 'angular-formio/resource';
import { Injectable, EventEmitter } from '@angular/core';
import { Formio } from 'formiojs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends FormioResourceService {
  _refresh: EventEmitter<object> = new EventEmitter();

  constructor(
    appConfig: FormioAppConfig, config: FormioResourceConfig, loader: FormioLoader, resourcesService: FormioResources

  ) {
    super(appConfig, config, loader, resourcesService);
  }
  setContext(route) {

  }
  setFormKey(formKey) {
    // this.formUrl = this.appConfig.appUrl + '/' + formKey;
  }
  loadForm() {

  }


  loadResource(route) {

  }
}
