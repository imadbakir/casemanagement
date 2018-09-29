import { FormioComponent, FormioAppConfig, FormioLoader, FormioService } from 'angular-formio';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { Formio } from 'formiojs';
import { ResourceService } from '../resource.service';
import { each, isEmpty, get } from 'lodash';

@Component({
    selector: 'app-formio',
    templateUrl: './formio.component.html',
    styleUrls: ['./formio.component.scss'],

})
export class AppFormioComponent extends FormioComponent implements OnInit {
    LanguageChanger: EventEmitter<string> = new EventEmitter();
    _config;
    _loader;
    constructor(_loader: FormioLoader, _config: FormioAppConfig, public translate: TranslateService,
        public formioService: ResourceService) {
        super(_loader, _config);
    }
    /* ngOnInit() {
        const currentLang = this.translate.currentLang;
        Formio.createForm(this.formioElement ? this.formioElement.nativeElement : null,
            this.formioService.form, { language: currentLang }).then(form => {
                console.log(form);
                console.log(this.formioElement);
                form.submission = this.formioService.resource;
                console.log(this.formioService.resource);
                this.translate.getTranslation(currentLang).subscribe(data => {
                    form.i18next.options.resources[currentLang] = {
                        translation: data
                    };
                    form.language = currentLang;
                });
                this.translate.onLangChange.subscribe(data => {
                    console.log(data); console.log('--');
                    form.i18next.options.resources[data.lang] = {
                        translation: data.translations
                    };
                    form.language = data.lang;
                });
            });
    }
} */

    ngOninit() {
        super.ngOnInit();
        this.translate.onLangChange.subscribe(data => {
            // this.language.emit(data);
        });

    }
    setForm(form) {
        const _this = this;
        this.form = form;
        // Only initialize a single formio instance.
        if (this.formio) {
            this.formio.form = this.form;
            return;
        }
        // Create the form.
        return Formio.createForm(this.formioElement ? this.formioElement.nativeElement : null, this.form, {
            icons: this._config ? this._config.icons : '',
            noAlerts: get(this.options, 'noAlerts', true),
            readOnly: this.readOnly,
            viewAsHtml: this.viewOnly,
            i18n: get(this.options, 'i18n', null),
            fileService: get(this.options, 'fileService', null),
            hooks: this.hooks
        }).then((formio) => {
            const currentLang = this.translate.currentLang;
            formio.submission = this.formioService.resource;
            console.log(formio);
            this.translate.getTranslation(currentLang).subscribe(data => {

                formio.i18next.options.resources[currentLang] = {
                    translation: data
                };
                formio.language = currentLang;
            });
            this.translate.onLangChange.subscribe(data => {
                formio.i18next.options.resources[data.lang] = {
                    translation: data.translations
                };
                formio.language = data.lang;
                console.log(formio);

            });
            _this.formio = formio;
            if (_this.url) {
                _this.formio.url = _this.url;
            }
            if (_this.src) {
                _this.formio.url = _this.src;
            }
            _this.formio.nosubmit = true;
            _this.formio.on('prevPage', function (data) { return _this.onPrevPage(data); });
            _this.formio.on('nextPage', function (data) { return _this.onNextPage(data); });
            _this.formio.on('change', function (value) { return _this.change.emit(value); });
            _this.formio.on('customEvent', function (event) {
                return _this.customEvent.emit(event);
            });
            _this.formio.on('submit', function (submission) {
                return _this.submitForm(submission);
            });
            _this.formio.on('error', function (err) { return _this.onError(err); });
            _this.formio.on('render', function () { return _this.render.emit(); });
            _this.formio.on('formLoad', function (loadedForm) {
                return _this.formLoad.emit(loadedForm);
            });
            _this.readyResolve(_this.formio);
            return _this.formio;
        });
    }
}
