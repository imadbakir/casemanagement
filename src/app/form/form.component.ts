import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ResourceService } from '../resource.service';
import { EventsService } from '../events.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormioResourceConfig, FormioResources } from 'angular-formio/resource';
import { LoadingController } from '@ionic/angular';
import { Formio, Utils } from 'formiojs';
import { FormioLoader, FormioAppConfig, FormioRefreshValue } from 'angular-formio';
import _ from 'lodash';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() formKey;
  @Input() resourceName;
  @Input() resourceId;
  @Input() readOnly;
  @Output() submit: EventEmitter<object> = new EventEmitter();
  public form: any;
  public resource: any;
  public resourceUrl?: string;
  public formUrl: string;
  public formFormio: any;
  public formio: any;
  public refresh: EventEmitter<FormioRefreshValue> = new EventEmitter();

  public resourceLoading?: Promise<any>;
  public resourceLoaded?: Promise<any>;
  public resourceResolve: any;
  public resourceReject: any;
  public resources: any;

  public formLoading?: Promise<any>;
  public formLoaded: Promise<any> = new Promise(() => { });
  public formResolve: any;
  public formReject: any;

  public parentsLoaded?: Promise<any>;
  public parentsResolve: any;
  public parentsReject: any;

  constructor(
    public service: ResourceService,
    public events: EventsService,
    public route: ActivatedRoute,
    public config: FormioResourceConfig,
    private eventService: EventsService,
    private loadingController: LoadingController,
    private loader: FormioLoader,
    private appConfig: FormioAppConfig,
    private resourcesService: FormioResources
  ) {
    this.formLoaded = new Promise(() => { });
    if (this.appConfig && this.appConfig.appUrl) {
      Formio.setBaseUrl(this.appConfig.apiUrl);
      Formio.setProjectUrl(this.appConfig.appUrl);
      Formio.formOnly = this.appConfig.formOnly;
    } else {
      console.error('You must provide an AppConfig within your application!');
    }
    // Create the form url and load the resources.
    this.resource = { data: {} };
    this.resourceLoaded = new Promise((resolve, reject) => {
      this.resourceResolve = resolve;
      this.resourceReject = reject;
    });
    this.formLoaded = new Promise((resolve, reject) => {
      this.formResolve = resolve;
      this.formReject = reject;
    });
    this.parentsLoaded = new Promise((resolve, reject) => {
      this.parentsResolve = resolve;
      this.parentsReject = reject;
    });
    // Add this resource service to the list of all resources in context.
    if (this.resourcesService) {
      this.resources = this.resourcesService.resources;
      this.resources[this.config.name] = this;
    }

  }
  setParents() {
    if (!this.config.parents || !this.config.parents.length || !this.form) {
      return;
    }

    if (!this.resourcesService) {
      console.warn(
        'You must provide the FormioResources within your application to use nested resources.'
      );
      return;
    }

    // Iterate through the list of parents.
    const _parentsLoaded: Array<Promise<any>> = [];
    this.config.parents.forEach((parent: any) => {
      const resourceName = parent.resource || parent;
      const resourceField = parent.field || parent;
      const filterResource = parent.hasOwnProperty('filter') ? parent.filter : true;
      if (this.resources.hasOwnProperty(resourceName)) {
        _parentsLoaded.push(
          this.resources[resourceName].resourceLoaded.then((resource: any) => {
            let parentPath = '';
            Utils.eachComponent(this.form.components, (component, path) => {
              if (component.key === resourceField) {
                component.hidden = true;
                component.clearOnHide = false;
                _.set(this.resource.data, path, resource);
                parentPath = path;
                return true;
              }
            });
            return {
              name: parentPath,
              filter: filterResource,
              resource
            };
          })
        );
      }
    });

    // When all the parents have loaded, emit that to the onParents emitter.
    Promise.all(_parentsLoaded).then((parents: any) => {
      this.parentsResolve(parents);
      this.refresh.emit({
        form: this.form,
        submission: this.resource
      });
    });
  }

  onSubmissionError(err: any) {
    this.resourceReject(err);
    this.onError(err);
  }
  setContext() {
    this.resource = { data: {} };
    this.resourceUrl = this.appConfig.appUrl + '/' + this.resourceName;
    if (this.resourceId) {
      this.resourceUrl += '/submission/' + this.resourceId;
    }
    this.formio = new Formio(this.resourceUrl);
    this.setParents();
  }
  loadResource() {
    this.setContext();
    this.loader.loading = true;
    this.resourceLoading = this.formio
      .loadSubmission(null, { ignoreCache: true })
      .then((resource) => {
        this.resource = resource;
        this.resourceResolve(resource);
        this.loader.loading = false;
        this.refresh.emit({
          property: 'submission',
          value: this.resource
        });
        return resource;
      }, (err) => { })
      .catch((err) => { });
    return this.resourceLoading;
  }
  loadForm() {
    this.formFormio = new Formio(this.formUrl);
    this.loader.loading = true;
    this.formLoading = this.formFormio
      .loadForm()
      .then((form) => {
        this.form = form;
        this.formResolve(form);
        this.loader.loading = false;
        this.setParents();
        return form;
      }, (err) => this.onFormError(err))
      .catch((err) => this.onFormError(err));
    return this.formLoading;
  }
  /* loadResource() {
     const route = new ActivatedRoute;
     route.snapshot = new ActivatedRouteSnapshot;
     route.snapshot.params = { id: this.resourceId, formKey: this.formKey, resourceName: this.resourceName };
     return this.service.loadResource(route);
   }
   setContext(id = '') {
     const route = new ActivatedRoute;
     route.snapshot = new ActivatedRouteSnapshot;
     route.snapshot.params = { id: this.resourceId, formKey: this.formKey, resourceName: this.resourceName };
     this.service.setContext(route);
   } */
  onFormError(err) {
    this.formReject(err);
    this.onError(err);
  }
  onError(error) {
    if (this.resourcesService) {
      this.resourcesService.error.emit(error);
    }
    throw error;
  }
  onSubmit(event) {
    this.save(this.resource).then((data) => {
      this.submit.emit(data);
    });
  }
  save(resource: any) {
    const formio = resource._id ? this.formio : this.formFormio;
    return formio
      .saveSubmission(resource)
      .then(
        (saved: any) => {
          this.resource = saved;
          saved._fvid = this.form._vid;
          return saved;
        },
        (err: any) => this.onError(err)
      )
      .catch((err: any) => this.onError(err));
  }
  ngOnInit() {
    this.formUrl = this.appConfig.appUrl + '/' + this.formKey;
    this.resourceUrl = this.appConfig.appUrl + '/' + this.resourceName;
    this.loadForm().then(() => {
      this.loadResource();
    });
  }
  ngOnDestroy() {
    Formio.clearCache();
  }

}
