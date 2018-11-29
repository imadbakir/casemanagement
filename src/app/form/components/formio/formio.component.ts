import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    FormioAlerts, FormioAppConfig, FormioError, FormioForm,
    FormioLoader, FormioOptions, FormioRefreshValue, FormioService
} from 'angular-formio';
import { Formio } from 'formiojs';
import { assign, each, get, isEmpty } from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-formio',
    templateUrl: './formio.component.html',
    styleUrls: ['./formio.component.scss'],

})
export class AppFormioComponent implements OnInit, OnChanges {
    private formioReady: Promise<Formio>;
    private formioReadyResolve: any;
    @Input() form?: FormioForm;
    @Input() submission?: any = {};
    @Input() src?: string;
    @Input() url?: string;
    @Input() service?: FormioService;
    @Input() options?: FormioOptions;
    @Input() formioOptions?: any;
    @Input() renderOptions?: any;
    @Input() readOnly?= false;
    @Input() viewOnly?= false;
    @Input() hideComponents?: string[];
    @Input() refresh?: EventEmitter<FormioRefreshValue>;
    @Input() error?: EventEmitter<any>;
    @Input() success?: EventEmitter<object>;
    @Input() language?: BehaviorSubject<string>;
    @Input() hooks?: any = {};
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
    interval;
    constructor(
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
            if (this.url) {
                this.formio.setUrl(this.url, this.formioOptions || {});
            }
            if (this.src) {
                this.formio.setUrl(this.src, this.formioOptions || {});
            }
            this.formio.submission = this.submission;

            this.formio.nosubmit = true;
            this.formio.on('prevPage', (data: any) => this.onPrevPage(data));
            this.formio.on('nextPage', (data: any) => this.onNextPage(data));
            this.formio.on('change', (value: any) => this.change.emit(value));
            this.formio.on('customEvent', (event: any) =>
                this.customEvent.emit(event)
            );
            this.formio.on('submit', (submission: any) =>
                this.submitForm(submission)
            );
            this.formio.on('error', (err: any) => this.onError(err));
            this.formio.on('render', () => this.render.emit());
            this.formio.on('formLoad', (loadedForm: any) =>
                this.formLoad.emit(loadedForm)
            );
            this.loader.loading = false;
            this.ready.emit(this);
            this.formioReadyResolve(this.formio);
            return this.formio;
        });
    }

    initialize() {
        if (this.initialized) {
            return;
        }

        this.options = Object.assign(
            {
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


    setNestedFormsSubmission(formio, submission) {
        formio.components.forEach(component => {
            if (component.type === 'form') {
                component.subFormReady.then(() => {
                    clearTimeout(this.interval);
                    this.interval = setTimeout(() => {
                        submission.data = this.fetchComponents(this.formio, submission);
                        this.formio.setSubmission(submission);
                        console.log(this.formio);
                    }, 300);
                    this.setNestedFormsSubmission(component.subForm, submission);
                });
            }
        });
    }

    fetchComponents(componentsComponent, dataObject) {
        let data = {};
        componentsComponent.components.forEach(component => {
            if (dataObject.data.hasOwnProperty(component.key) && component.type !== 'form') {
                data[component.key] = dataObject.data[component.key];
            } else if (component.type === 'form') {
                data[component.key] = { data: this.fetchComponents(component.subForm, dataObject) };
            } else if (component.hasOwnProperty('components') && component.components !== null) {

                data = { ...data, ...this.fetchComponents(component, dataObject) };
            }
        });
        return data;
    }

    onRefresh(refresh: FormioRefreshValue) {
        this.formioReady.then(() => {
            if (refresh.form) {
                this.formio.setForm(refresh.form).then(() => {
                    if (refresh.submission) {
                        this.setNestedFormsSubmission(this.formio, refresh.submission);
                    }
                });
            } else if (refresh.submission) {
                this.setNestedFormsSubmission(this.formio, refresh.submission);
            } else {
                switch (refresh.property) {
                    case 'submission':
                        this.setNestedFormsSubmission(this.formio, refresh.value);
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
    onError(err: any) {
        this.loader.loading = false;
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
    submitExecute(submission: object) {
        if (this.service && !this.url) {
            this.service
                .saveSubmission(submission)
                .subscribe(
                    (sub: {}) => this.onSubmit(sub, true),
                    err => this.onError(err)
                );
        } else {
            this.onSubmit(submission, false);
        }
    }

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
    ngOnInit() {
        this.initialize();
        if (this.language) {
            this.language.subscribe((lang: string) => {
                this.formioReady.then(() => {
                    if (!this.formio.i18next.options.resources[lang]) {
                        this.translate.getTranslation(lang).subscribe(translation => {
                            this.formio.i18next.options.resources[lang] = { translation: translation };
                            this.formio.language = lang;
                        });
                    } else {
                        this.formio.language = lang;
                    }
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

        if (this.src) {
            if (!this.service) {
                this.service = new FormioService(this.src);
            }
            this.loader.loading = true;
            this.service.loadForm({ params: { live: 1 } }).subscribe(
                (form: FormioForm) => {
                    if (form && form.components) {
                        this.setForm(form);
                    }

                    // if a submission is also provided.
                    if (
                        isEmpty(this.submission) &&
                        this.service &&
                        this.service.formio.submissionId
                    ) {
                        this.service.loadSubmission().subscribe(
                            (submission: any) => {
                                if (this.readOnly) {
                                    this.formio.options.readOnly = true;
                                }
                                this.submission = this.formio.submission = submission;
                            },
                            err => this.onError(err)
                        );
                    }
                },
                err => this.onError(err)
            );
        }
        if (this.url && !this.service) {
            this.service = new FormioService(this.url);
        }
    }
    ngOnChanges(changes: any) {
        this.initialize();

        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }

        this.formioReady.then(() => {

            if (changes.submission && changes.submission.currentValue) {
                this.setNestedFormsSubmission(this.formio, changes.submission.currentValue);
            }

            if (changes.hideComponents) {
                this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    }
}
