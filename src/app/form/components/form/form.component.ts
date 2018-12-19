import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioLoader, FormioRefreshValue } from 'angular-formio';
import { FormioResourceConfig, FormioResources } from 'angular-formio/resource';
import { Formio, Utils } from 'formiojs';
import _ from 'lodash';
import { EventsService } from '../../../core/services/events.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ExternalService } from '../../../core/services/external.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingController } from '@ionic/angular';

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
  @Output() customEvent: EventEmitter<object> = new EventEmitter();
  public form: any;
  public resource: any;
  public resourceUrl?: string;
  public formUrl: string;
  public formFormio: any;
  public formio: any;
  public refresh: EventEmitter<FormioRefreshValue> = new EventEmitter();
  public language: BehaviorSubject<String> = new BehaviorSubject('');
  public loading;
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
    public events: EventsService,
    public externalService: ExternalService,
    public route: ActivatedRoute,
    public config: FormioResourceConfig,
    public auth: AuthService,
    public translate: TranslateService,
    public loadingController: LoadingController,
    private loader: FormioLoader,
    private appConfig: FormioAppConfig,
    private resourcesService: FormioResources,

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
  async presentLoading() {
    this.loading = await this.loadingController.create({});
    return await this.loading.present();
  }
  async dismissLoading() {
    return await this.loading.dismiss();
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
        /* this.refresh.emit({
          property: 'submission',
          value: this.resource
        }); */
        return resource;
      }, (err) => { })
      .catch((err) => {
        console.log(err);
      });
    return this.resourceLoading;
  }
  parseVariables(string) {
    const vars = string.match(/\[(.*?)\]/g);
    if (vars) {
      vars.forEach(variable => {
        const value = _.get(this.resource, variable.replace(/\[|\]/g, '').replace('submission.', ''));
        string = string.replace(variable, value);
      });
    }

    return string;
  }
  onCustomEvent(event) {
    try {
      if (event.hasOwnProperty('type')) {
        switch (event.type) {
          case 'complete':
            this.onSubmit(event);
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
    this.customEvent.emit(event);
  }
  onFormLoad(event) {
    _.set(this.resource, 'extras.currentUser', this.auth.getUser().username);
    if (event.hasOwnProperty('properties') && event.properties.onFormLoad) {
      try {
        const calls = JSON.parse(event.properties.onFormLoad);
        calls.forEach(call => {
          if (call.url && call.method) {
            this.externalService.apiCall(call.method, this.parseVariables(call.url)).subscribe(response => {
              if (response['bank_account_status']) {
                this.resource = Utils.evaluate(call.success, { submission: this.resource, response: response }, 'submission');
                this.refresh.emit({
                  property: 'submission',
                  value: this.resource
                });
              } else {
                this.externalService.apiCall('get',
                  this.parseVariables(`https://demo1386417.mockable.io/branches/${response['branch_id']}/1`)).subscribe(response2 => {
                    this.externalService.apiCall('get',
                      this.parseVariables(`https://demo1386417.mockable.io/users/${response2}`)).subscribe(response3 => {
                        response = { ...response, ...{ bank_name: response3['bank_name'], iban: response3['iban'] } };
                        this.resource = Utils.evaluate(call.success, { submission: this.resource, response: response }, 'submission');

                        this.refresh.emit({
                          property: 'submission',
                          value: this.resource
                        });
                      });
                  });
              }

            });
          }
        });
      } catch (e) {
        this.refresh.emit({
          property: 'submission',
          value: this.resource
        });
        console.warn(e);
        return false;
      }
    }

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
  makeRequest() {
    this.externalService.apiCall('post', 'http://demo1386417.mockable.io/save-request', {
      'request_id': this.resource._id,
      'requester_id': this.resource.data['user_id'],
      'requester_name': this.resource.data['orphan_name'],
      'status': this.resource.data['payment_status'],
      'created_on': new Date(),
      'payment_status_id': this.resource.data['payment_status'],
      'due_date': this.resource.data['dueDate'],
      'amount': this.resource.data['amount'],
      'child_id': this.resource.data['child'].id,
      'iban': this.resource.data['iban']
    }).subscribe(response => {
      console.log(response);
    });
  }
  onSubmit(event) {
    this.presentLoading().then(() => {
      this.save(this.resource).then((data) => {
        this.submit.emit(data);
        this.dismissLoading();
        if (this.formKey === 'orphanmanagement') {
          this.makeRequest();
        }

      });
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
    /*
      if form = 'A'
        data.path.currentUser = 'ahmad'
        data.currentUser = this.auth.getUser().username);

      if form = 'B'
        data.path.currentPath = '/etc/camunda'
        call method
      if form = 'C'
        data.path.currentDate = '2018/12/06'

  */
    this.presentLoading().then(() => {
      this.loadForm().then((form) => {

        if (this.resourceId) {
          setTimeout(() => {
            this.loadResource().then(() => {
              this.resourceLoaded.then(() => {
                this.onFormLoad(form);
                this.dismissLoading();
              });
            });
          }, 0);
        } else {
          this.onFormLoad(form);
          this.dismissLoading();
        }

      });
    });

    this.language.next(this.translate.currentLang);

    this.translate.onLangChange.subscribe(data => {
      this.language.next(data.lang);
    });
  }
  ngOnDestroy() {
    Formio.clearCache();
  }

}
