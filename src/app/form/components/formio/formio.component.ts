import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Form, Formio, Utils } from 'formiojs';
import { assign, get } from 'lodash';
import { ReplaySubject } from 'rxjs';
import { EnvService } from '../../../core/services/env.service';
import { ExternalService } from '../../../core/services/external.service';
import { FormioAlerts } from '../alerts/formio.alerts';
import { FormioLoader } from '../loader/formio.loader';

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
    @Input() form?: any;
    @Input() submission?: any = {};
    @Input() src?: string;
    @Input() url?: string;
    @Input() options?: any;
    @Input() formioOptions?: any;
    @Input() renderOptions?: any;
    @Input() readOnly?= false;
    @Input() viewOnly?= false;
    @Input() hideComponents?: string[];
    @Input() refresh?: EventEmitter<any>;
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
    timeout;

    constructor(
        private alerts: FormioAlerts,
        private env: EnvService,
        public loader: FormioLoader,
        public externalService: ExternalService,
        public translate: TranslateService
    ) {
        if (this.env) {
            Formio.setBaseUrl(this.env.formioApiUrl);
            Formio.setProjectUrl(this.env.formioApiUrl);
        } else {
            console.warn('You must provide formio Config');
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
    async setForm(form) {
        this.form = form;
        if (this.formio) {
            this.formio.destroy();
        }
        // Clear out the element to render the new form.
        if (this.formioElement && this.formioElement.nativeElement) {
            this.formioElement.nativeElement.innerHTML = '';
        }
        const Renderer = Form;
        this.formio = await (new Renderer(this.formioElement ? this.formioElement.nativeElement : null,
            this.form,
            assign({}, {
                icons: get(this.env, 'icons', 'fontawesome'),
                noAlerts: get(this.options, 'noAlerts', true),
                readOnly: this.readOnly,
                viewAsHtml: this.viewOnly,
                i18n: get(this.options, 'i18n', null),
                fileService: get(this.options, 'fileService', null),
                hooks: this.hooks
            }, this.renderOptions || {}))).create();


        if (this.url) {
            this.formio.setUrl(this.url, this.formioOptions || {});
        }
        if (this.src) {
            this.formio.setUrl(this.src, this.formioOptions || {});
        }
        this.formio.nosubmit = true;
        this.formio.on('languageChanged', () => {
            this.assignFormOptions(this.formio);
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
        this.formio.on('render', () => this.render.emit());
        this.formio.on('formLoad', (loadedForm: any) =>
            this.formLoad.emit(loadedForm)
        );

        this.formio.form = this.form;
        return this.formio.ready.then(() => {
            this.assignVersions(this.formio);
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
        this.loader.loading = true;
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


    /**
     * Executed when a refresh event is emitted.
     * Either or both form and submission are assigned.
     * @param refresh
     *  Refresh object
     */
    onRefresh(refresh) {
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
                        this.formio.submission = refresh.value;
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
        console.log(submission);
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
        this.loader.loading = false;
        this.alerts.setAlerts([]);
        this.submitting = false;

        if (!err) {
            return;
        }

        // Make sure it is an array.
        const errors = Array.isArray(err) ? err : [err];

        // Emit these errors again.
        this.errorChange.emit(errors);

        // Iterate through each one and set the alerts array.
        errors.forEach((error: any) => {
            const {
                message,
                paths,
            } = error
                    ? error.details
                        ? {
                            message: error.details.map((detail) => detail.message).join(' '),
                            paths: error.details.map((detail) => detail.path),
                        }
                        : {
                            message: error.message || error.toString(),
                            paths: error.path ? [error.path] : [],
                        }
                    : {
                        message: '',
                        paths: [],
                    };

            this.alerts.addAlert({
                type: 'danger',
                message,
            });

            paths.forEach((path) => {
                const component = this.formio.getComponent(path);
                const components = Array.isArray(component) ? component : [component];

                components.forEach((comp) => comp.setCustomValidity(message, true));
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
            beforeSubmit(submission, (err, sub: object) => {
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
        const forms = Utils.findComponents(formio.components, { type: 'form' });
        formio.formReady.then(() => {
            if (!this.version || !this.version[formio.component.key.toLowerCase()]) {
                if (!this.submission.version) {
                    this.submission.version = {};
                }
                this.submission.version['v_' + formio._form.path] = { value: formio._form._vid, type: 'string' };
            }
        });
        if (forms.length > 0) {
            clearTimeout(this.timeout);
            this.loader.loading = true;

            forms.forEach(component => {
                if (this.version && this.version[component.component.key.toLowerCase()]) {
                    this.loader.loading = true;
                    component.component.form = component.component.form + '/v/' + this.version[component.component.key.toLowerCase()];

                }
                component.subFormReady.then((form) => {
                    form.formReady.then(() => {
                        this.assignVersions(form);
                    });
                });
            });
        } else {
            clearTimeout(this.timeout);
            formio.ready.then(() => {
                this.timeout = setTimeout(() => {
                    this.loader.loading = false;
                }, 100);
            });
        }


        /* Utils.eachComponent(formio.components, (component) => {
             if (component.component.properties) {
                 component.component.options = assign({}, {
                     readOnly: component.component.properties.readOnly === 'true',
                     viewAsHtml: component.component.properties.readOnly === 'true'
                 });
             }
             if (component.type === 'form') {
 
             }
         }, false); */
    }


    /**
     * Search deeply for form components and assigns Options and Langage to them
     * Assign readOnly and ViewAsHtml properties from API properties.
     * @param formio
     *  Formio Webform object
     */
    assignFormOptions(formio) {
        const forms = Utils.findComponents(formio.components, { type: 'form' });
        if (forms.length > 0) {
            forms.forEach(component => {
                component.subFormReady.then((form) => {
                    component.subForm.options = assign({}, {
                        language: this.translate.currentLang,
                        readOnly: component.component.properties.readOnly === 'true',
                        viewAsHtml: component.component.properties.readOnly === 'true',
                    });
                    form.formReady.then(() => {
                        form.language = this.translate.currentLang;
                        this.assignFormOptions(form);
                    });
                });
            });
        }
    }

    /**
   * Formio Custom Event Callback
   * @param event
   *  Formio CustomEvent
   */

    onCustomEvent(event) {
        event.submission = this.submission;
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
            this.refresh.subscribe((refresh) =>
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
        // this.language.unsubscribe();
    }
    ngOnChanges(changes: any) {
        this.initialize();

        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }

        this.formioReady.then(() => {
            if (changes.hideComponents) {
                this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    }
}
