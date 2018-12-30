import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Optional, Output, ViewChild, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormioAlerts, FormioAppConfig, FormioError, FormioForm, FormioLoader, FormioOptions, FormioRefreshValue } from 'angular-formio';
import { Formio, Utils } from 'formiojs';
import { assign, each, get } from 'lodash';
import { ReplaySubject } from 'rxjs';
import { ExternalService } from '../../../core/services/external.service';

/**
 * Formio Component
 * Initilizes the form & assigns data and options
 */
@Component({
    selector: 'app-formio',
    templateUrl: './formio.component.html',
    styleUrls: ['./formio.component.scss'],

})
export class AppFormioComponent implements OnInit, OnChanges, OnDestroy {
    private formioReady: Promise<Formio>;
    private formioReadyResolve: any;
    @Input() form?: FormioForm;
    @Input() submission?: any = {};
    @Input() src?: string;
    @Input() url?: string;
    @Input() options?: FormioOptions;
    @Input() formioOptions?: any;
    @Input() renderOptions?: any;
    @Input() readOnly?= false;
    @Input() viewOnly?= false;
    @Input() hideComponents?: string[];
    @Input() refresh?: EventEmitter<FormioRefreshValue>;
    @Input() error?: EventEmitter<any>;
    @Input() success?: EventEmitter<object>;
    @Input() language?: ReplaySubject<string>;
    @Input() hooks?: any = {};
    @Input() version?: any = [];
    @Output() render: EventEmitter<object>;
    @Output() customEvent: EventEmitter<object>;
    @Output() submit: EventEmitter<object>;
    @Output() prevPage: EventEmitter<object>;
    @Output() nextPage: EventEmitter<object>;
    @Output() beforeSubmit: EventEmitter<object>;
    @Output() change: EventEmitter<object>;
    @Output() invalid: EventEmitter<boolean>;
    @Output() errorChange: EventEmitter<any>;
    @Output() formLoad: EventEmitter<any>;
    @Output() ready: EventEmitter<AppFormioComponent>;
    @ViewChild('formio') formioElement?: ElementRef;

    private submitting: boolean;
    public formio: any;
    public initialized: boolean;
    public alerts: FormioAlerts;
    hideForm = true;
    constructor(
        public externalService: ExternalService,
        private loader: FormioLoader,
        @Optional() private config: FormioAppConfig,
        public translate: TranslateService
    ) {
        if (this.config) {
            Formio.setBaseUrl(this.config.apiUrl);
            Formio.setProjectUrl(this.config.appUrl);
        } else {
            console.warn('You must provide an AppConfig within your application!');
        }

        this.formioReady = new Promise(ready => {
            this.formioReadyResolve = ready;
        });

        this.submitting = false;
        this.alerts = new FormioAlerts();
        this.beforeSubmit = new EventEmitter();
        this.prevPage = new EventEmitter();
        this.nextPage = new EventEmitter();
        this.submit = new EventEmitter();
        this.errorChange = new EventEmitter();
        this.invalid = new EventEmitter();
        this.change = new EventEmitter();
        this.customEvent = new EventEmitter();
        this.render = new EventEmitter();
        this.formLoad = new EventEmitter();
        this.ready = new EventEmitter();
        this.initialized = false;
        this.alerts.alerts = [];

    }

    /**
     * Creates form and assigns events
     * @param form
     *  formio Form Object
     */

    setForm(form: FormioForm) {
        this.form = form;
        // Only initialize a single formio instance.
        if (this.formio) {
            // this.formio.form = this.form;
            // return;
            this.formio = {};
        }
        // Create the form.
        return Formio.createForm(this.formioElement ? this.formioElement.nativeElement : null, this.form, assign({}, {
            icons: get(this.config, 'icons', 'fontawesome'),
            noAlerts: get(this.options, 'noAlerts', true),
            readOnly: this.readOnly,
            viewAsHtml: this.viewOnly,
            i18n: get(this.options, 'i18n', null),
            fileService: get(this.options, 'fileService', null),
            hooks: this.hooks
        }, this.renderOptions || {})).then((formio) => {
            this.formio = formio;
            this.assignVersions(this.formio);
            if (this.url) {
                this.formio.setUrl(this.url, this.formioOptions || {});
            }
            if (this.src) {
                this.formio.setUrl(this.src, this.formioOptions || {});
            }
            this.formio.submission = this.submission;
            this.formio.nosubmit = true;
            this.assignFormOptions(this.formio);

            this.formio.on('languageChanged', () => {
                setTimeout(() => {
                    this.assignFormOptions(this.formio);

                }, 100);

                const choices = this.formio.element.querySelectorAll('.choices') || [];
                choices.forEach((el) => {
                    el.setAttribute('dir', this.formio.i18next.dir());
                });
            });
            this.formio.on('prevPage', (data: any) => this.onPrevPage(data));
            this.formio.on('nextPage', (data: any) => this.onNextPage(data));
            this.formio.on('change', (value: any) => this.change.emit(value));
            this.formio.on('customEvent', (event: any) =>
                this.onCustomEvent(event)
            );
            this.formio.on('submit', (submission: any) =>
                this.submitForm(submission)
            );
            this.formio.on('error', (err: any) => this.onError(err));
            this.formio.on('render', () => {
                this.render.emit();
            });
            this.formio.on('formLoad', (loadedForm: any) => {
                this.formLoad.emit(loadedForm);
            }
            );

            this.ready.emit(this);
            this.formioReadyResolve(this.formio);
            return this.formio;
        });
    }

    /**
     * init options object
     */
    initialize() {
        if (this.initialized) {
            return;
        }
        this.options = Object.assign(
            {
                language: this.translate.currentLang,
                i18n: {},
                errors: {
                    message: 'Please fix the following errors before submitting.'
                },
                alerts: {
                    submitMessage: 'Submission Complete.'
                },
                disableAlerts: false,
                hooks: {
                    beforeSubmit: null
                }
            },
            this.options
        );
        this.initialized = true;
    }


    /**
     * Executed when a refresh event is emitted.
     * Either or both form and submission are assigned.
     * @param refresh
     *  Refresh object
     */
    onRefresh(refresh: FormioRefreshValue) {
        this.formioReady.then(() => {
            if (refresh.form) {
                this.formio.setForm(refresh.form).then(() => {
                    if (refresh.submission) {
                        this.formio.setSubmission(refresh.submission);
                    }
                });
            } else if (refresh.submission) {
                this.formio.setSubmission(refresh.submission);

            } else {
                switch (refresh.property) {
                    case 'submission':
                        this.formio.setSubmission(refresh.value);


                        break;
                    case 'form':
                        this.formio.form = refresh.value;
                        break;
                }
            }
        });
    }

    onPrevPage(data: any) {
        this.alerts.setAlerts([]);
        this.prevPage.emit(data);
    }
    onNextPage(data: any) {
        this.alerts.setAlerts([]);
        this.nextPage.emit(data);
    }

    /**
     * Save submission if not saved and emit submit event
     * @param submission
     *  submission object
     * @param saved
     *  is data already saved
     */
    onSubmit(submission: any, saved: boolean) {
        this.submitting = false;
        if (saved) {
            this.formio.emit('submitDone', submission);
        }
        this.submit.emit(submission);
        if (!this.success) {
            this.alerts.setAlert({
                type: 'success',
                message: get(this.options, 'alerts.submitMessage')
            });
        }
    }

    /**
     * on Form Error callback
     * @param err
     *  error object.
     */
    onError(err: any) {
        this.alerts.setAlerts([]);
        this.submitting = false;
        if (!err) {
            return;
        }

        // Make sure it is an array.
        err = err instanceof Array ? err : [err];

        // Emit these errors again.
        this.errorChange.emit(err);

        // Iterate through each one and set the alerts array.
        each(err, (error: any) => {
            this.alerts.addAlert({
                type: 'danger',
                message: error.message || error.toString()
            });
        });
    }

    /**
     * Execute submission
     * @param submission
     *  Submission Oject
     */
    submitExecute(submission: object) {
        this.onSubmit(submission, false);
    }

    /**
     * Formio SubmitForm event Callback
     * @param submission
     *  Submission Object
     */
    submitForm(submission: any) {
        // Keep double submits from occurring...
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        this.beforeSubmit.emit(submission);

        // if they provide a beforeSubmit hook, then allow them to alter the submission asynchronously
        // or even provide a custom Error method.
        const beforeSubmit = get(this.options, 'hooks.beforeSubmit');
        if (beforeSubmit) {
            beforeSubmit(submission, (err: FormioError, sub: object) => {
                if (err) {
                    this.onError(err);
                    return;
                }
                this.submitExecute(sub);
            });
        } else {
            this.submitExecute(submission);
        }
    }

    /**
     * Search deeply for form components and assigns Form Version to them.
     * @param formio
     *  Formio Webform object
     */
    assignVersions(formio) {

        formio.formReady.then(() => {
            if (!this.version || !this.version[formio.component.key.toLowerCase()]) {
                if (!this.submission.version) {
                    this.submission.version = {};
                }
                this.submission.version['v_' + formio._form.path] = { value: formio._form._vid, type: 'string' };
            }
        });

        Utils.eachComponent(formio.components, (component) => {
            /*
            if (component.component.hasOwnProperty('properties') &&
                component.component.properties.hasOwnProperty('readOnly')) {
                component.options.readOnly = true;
                component.options.viewAsHtml = true;
                console.log(component.key);
            }*/
            if (component.component.properties) {
                component.component.options = assign({}, {
                    readOnly: component.component.properties.readOnly === 'true',
                    viewAsHtml: component.component.properties.readOnly === 'true'
                });
            }
            if (component.type === 'form') {
                if (this.version && this.version[component.component.key.toLowerCase()]) {
                    component.component.form = component.component.form + '/v/' + this.version[component.component.key.toLowerCase()];

                }
                component.subFormReady.then((form) => {
                    form.formReady.then(() => {
                        this.assignVersions(form);
                    });
                });

            }
        }, false);
    }

    /**
     * Search deeply for form components and assigns Form Version to them.
     * @param formio
     *  Formio Webform object
     */


    /**
     * Search deeply for form components and assigns Options and Langage to them
     * Assign readOnly and ViewAsHtml properties from API properties.
     * @param formio
     *  Formio Webform object
     */
    assignFormOptions(formio) {
        const forms = Utils.findComponents(formio.components, { type: 'form' });
        if (forms.length > 0) {
            this.loader.loading = true;
            forms.forEach(component => {
                component.subFormReady.then((form) => {
                    component.subForm.options = assign({}, {
                        language: this.translate.currentLang,
                        icons: get(this.config, 'icons', 'fontawesome'),
                        noAlerts: get(this.options, 'noAlerts', true),
                        readOnly: component.component.properties.readOnly === 'true',
                        viewAsHtml: component.component.properties.readOnly === 'true',
                        i18n: get(this.options, 'i18n', null),
                        fileService: get(this.options, 'fileService', null),
                    });
                    form.formReady.then(() => {
                        form.language = this.translate.currentLang;
                        this.assignFormOptions(form);
                    });
                });
            });
        } else {
            let once = true;
            formio.on('render', () => {
                if (once) {
                    this.loader.loading = false;
                    this.hideForm = false;
                    once = true;
                }

            });
        }
    }

    /**
   * Formio Custom Event Callback
   * @param event
   *  Formio CustomEvent
   */

    onCustomEvent(event) {
        console.log(event);
        // event.submission = this.submission;
        this.customEvent.emit(event);
    }

    /**
     * On Component Init
     * Subscribe to events and assign callbacks
     */
    ngOnInit() {
        this.initialize();
        if (this.language) {
            this.language.subscribe((lang: string) => {
                this.formioReady.then(() => {
                    this.translate.getTranslation(lang).subscribe(translation => {
                        this.formio.addLanguage(lang, translation);
                        this.formio.language = lang;

                    });
                });
            });
        }

        if (this.refresh) {
            this.refresh.subscribe((refresh: FormioRefreshValue) =>
                this.onRefresh(refresh)
            );
        }

        if (this.error) {
            this.error.subscribe((err: any) => this.onError(err));
        }

        if (this.success) {
            this.success.subscribe((message: string) => {
                this.alerts.setAlert({
                    type: 'success',
                    message: message || get(this.options, 'alerts.submitMessage')
                });
            });
        }
    }
    ngOnDestroy() {
        this.language.unsubscribe();
    }
    ngOnChanges(changes: any) {
        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }

        this.formioReady.then(() => {

            if (changes.submission && changes.submission.currentValue) {
                // this.formio.submission = changes.submission.currentValue;
            }

            if (changes.hideComponents) {
                this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    }
}
