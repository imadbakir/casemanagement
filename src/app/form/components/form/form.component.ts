import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Formio, Utils } from 'formiojs';
import _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { EnvService } from '../../../core/services/env.service';
import { EventsService } from '../../../core/services/events.service';
import { ExternalService } from '../../../core/services/external.service';

/**
 * FormComponent
 * Handles forms and submissions
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() formKey;
  @Input() resourceName;
  @Input() resourceId;
  @Input() extra;
  @Input() readOnly;
  @Input() version;
  @Input() executionVariables;
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() customEvent: EventEmitter<object> = new EventEmitter();
  public form: any;
  public resource: any;
  public resourceUrl?: string;
  public formUrl: string;
  public formFormio: any;
  public formio: any;
  public refresh: EventEmitter<any> = new EventEmitter();
  public language: ReplaySubject<String> = new ReplaySubject(1);
  public resourceLoading?: Promise<any>;
  public resourceLoaded?: Promise<any>;
  public resourceResolve: any;
  public resourceReject: any;
  public resources: any;

  public formLoading?: Promise<any>;
  public formLoaded: Promise<any> = new Promise(() => { });
  public formResolve: any;
  public formReject: any;



  constructor(
    public events: EventsService,
    public externalService: ExternalService,
    public route: ActivatedRoute,
    public auth: AuthService,
    public translate: TranslateService,
    private env: EnvService,

  ) {
    this.formLoaded = new Promise(() => { });
    if (this.env && this.env.formioAppUrl) {
      Formio.setBaseUrl(this.env.formioApiUrl);
      Formio.setProjectUrl(this.env.formioAppUrl);
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
  }


  onSubmissionError(err: any) {
    this.resourceReject(err);
    this.onError(err);
  }

  /**
   * Sets Resource and Form URL and initilizes Resource Object
   * Sets initial Form's Version.
   */
  setContext() {
    this.resource = { data: {} };
    this.resourceUrl = this.env.formioAppUrl + '/' + this.resourceName;
    this.formUrl = this.env.formioAppUrl + '/' + this.formKey;
    if (this.resourceId) {
      this.resourceUrl += '/submission/' + this.resourceId;
    }
    if (this.version && this.version[this.formKey.toLowerCase()]) {
      this.formUrl += '/v/' + this.version[this.formKey];
    }
    this.formio = new Formio(this.resourceUrl);
  }

  /**
   * Loads Formio Resource
   */
  loadResource() {
    this.setContext();
    this.resourceLoading = this.formio
      .loadSubmission(null, { ignoreCache: true })
      .then((resource) => {
        resource.data = { executionVariables: this.executionVariables, extras: this.extra, ...resource.data };
        this.resource = resource;

        this.resourceResolve(resource);
        return resource;
      }, (err) => { })
      .catch((err) => {
        console.log(err);
      });
    return this.resourceLoading;
  }

  /**
   * Gets a string as param, searchs for variables :eg[submission.data.user_id] and
   * deep searchs for it inside resource object.
   * Returns a string with the variable replaced with its value, undefined if not found.
   * @param string
   */

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

  /**
   * Formio Custom Event Callback
   * @param event
   *  Formio CustomEvent
   */
  onCustomEvent(event) {
    try {
      if (event.hasOwnProperty('type')) {
        switch (event.type) {
          case 'complete':
            this.onSubmit(event).then(() => {
              if (event.component.properties && event.component.properties['variables']) {
                event.component.properties['variables'] = this.parseVariables(event.component.properties['variables']);
              }
              this.customEvent.emit(event);
            });
            break;
          default:
            this.customEvent.emit(event);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Searchs form object properties for OnFormLoad Actions and executes them if any.
   * @param event
   *  contains formio form object
   */
  onFormLoad(event) {
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
          } else {
            this.resource = Utils.evaluate(call.success, { submission: this.resource }, 'submission');
            console.log(this.resource);
            this.refresh.emit({
              property: 'submission',
              value: this.resource
            });
          }
        });
        if (!calls || calls.length === 0) {
          this.refresh.emit({
            property: 'submission',
            value: this.resource
          });
        }
      } catch (e) {
        this.refresh.emit({
          property: 'submission',
          value: this.resource
        });
        console.warn(e);
        return false;
      }
    } else {
      this.refresh.emit({
        property: 'submission',
        value: this.resource
      });
    }

  }
  /**
   * Loads Formio Form Object.
   */
  loadForm() {
    this.formFormio = new Formio(this.formUrl);
    this.formLoading = this.formFormio
      .loadForm()
      .then((form) => {
        this.form = form;
        this.formResolve(form);
        return form;
      }, (err) => this.onFormError(err))
      .catch((err) => this.onFormError(err));
    return this.formLoading;
  }

  /**
   * FormLoad Error Callback
   * @param err
   */
  onFormError(err) {
    this.formReject(err);
    this.onError(err);
  }

  /**
   * On Resource load / save Error
   * @param error
   */
  onError(error) {
    throw error;
  }

  /**
   * Temp Function to save data to mock.
   */
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

  /**
   * On Form Submit Callback
   * @param event
   *  Form Submission Event
   */
  onSubmit(event) {
    const submission = event.submission ? event.submission : event;
    return this.save(submission).then((data) => {
      submission._id = data._id;
      this.submit.emit(submission);
      if (this.formKey === 'orphanmanagement') {
        this.makeRequest();
      }
    });

  }

  /**
   * Save Formio Resource
   * @param resource
   */
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

    this.setContext();
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
    this.loadForm();

    if (this.resourceId) {
      this.loadResource().then(() => {
        this.formLoaded.then((form) => {
          this.onFormLoad(form);
        });
      });
    } else {
      this.formLoaded.then((form) => {
        this.onFormLoad(form);
      });
    }
    this.language.next(this.translate.currentLang);

    this.translate.onLangChange.subscribe(data => {
      this.language.next(data.lang);
    });
  }


  ngOnDestroy() {
    // Formio.clearCache();
  }

}
