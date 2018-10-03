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
    this.resourceId = route.snapshot.params['id'];
    this.resource = { data: {} };
    this.resourceUrl = this.appConfig.appUrl + '/' + route.snapshot.params['resourceName'];
    this.formUrl = this.appConfig.appUrl + '/' + route.snapshot.params['formKey'];
    if (this.resourceId) {
      this.resourceUrl += '/submission/' + this.resourceId;
    }
    this.formio = new Formio(this.resourceUrl);
    this.setParents();
    this.loadForm();
  }
  setFormKey(formKey) {
    // this.formUrl = this.appConfig.appUrl + '/' + formKey;
  }
  loadForm() {
    const _this = this;
    this.formFormio = new Formio(this.formUrl);
    this.loader.loading = true;
    this.formLoading = this.formFormio
      .loadForm()
      .then(function (form) {
        _this.form = form;
        _this.formResolve(form);
        _this.loader.loading = false;
        _this.setParents();
        return form;
      }, function (err) { return _this.onFormError(err); })
      .catch(function (err) { return _this.onFormError(err); });
    return this.formLoading;
  }


  loadResource(route) {
    const _this = this;
    this.setContext(route);
    this.loader.loading = true;
    this.resourceLoading = this.formio
      .loadSubmission(null, { ignoreCache: true })
      .then(function (resource) {
        _this.resource = resource;
        _this.resourceResolve(resource);
        _this.loader.loading = false;
        _this._refresh.emit({
          property: 'submission',
          value: _this.resource
        });
        return resource;
      }, function (err) { return _this.onSubmissionError(err); })
      .catch(function (err) { return _this.onSubmissionError(err); });
    return this.resourceLoading;
  }
}
