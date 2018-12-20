import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    FormioAlerts,
    FormioAppConfig,
    FormioError,
    FormioForm,
    FormioLoader,
    FormioOptions,
    FormioRefreshValue
} from 'angular-formio';
import { Formio, Utils } from 'formiojs';
import { assign, each, get } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { ExternalService } from '../../../core/services/external.service';

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
    interval;
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
            console.log(formio);
            this.formio.nosubmit = true;
            this.formio.on('languageChanged', () => {
                setTimeout(() => {
                    this.assignFormOptions(this.formio);
                    // this.assignLang(this.formio, this.translate.currentLang);
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
                this.customEvent.emit(event)
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
        this.onSubmit(submission, false);
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
    assignVersions(formio) {
        Utils.eachComponent(formio.components, (component) => {
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
    assignFormOptions(formio) {
        Utils.eachComponent(formio.components, (component) => {
            if (component.type === 'form') {
                component.subFormReady.then((form) => {
                    component.subForm.options = assign({}, {
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

            }
        }, false);
    }

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
    ngOnChanges(changes: any) {

        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }

        this.formioReady.then(() => {

            if (changes.submission && changes.submission.currentValue) {
                this.formio.submission = changes.submission.currentValue;
            }

            if (changes.hideComponents) {
                this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    }
}
