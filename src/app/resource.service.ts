import { FormioAppConfig, FormioLoader } from 'angular-formio';
import { FormioResourceConfig, FormioResources } from 'angular-formio/resource';
import { FormioResourceService } from 'angular-formio/resource';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends FormioResourceService {
  constructor(
    appConfig: FormioAppConfig, config: FormioResourceConfig, loader: FormioLoader, resourcesService: FormioResources

  ) {
    super(appConfig, config, loader, resourcesService);
  }
  initialize() {
    this.formUrl = this.appConfig.appUrl + '/edittask';

    super.initialize();
  }
  loadResourceCustom(route, formKey, resourceName) {
    this.config.form = resourceName;
    console.log(this.config);
   return super.loadResource(route);
  }
}
