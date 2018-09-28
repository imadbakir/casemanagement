import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormioAuthService } from 'angular-formio/auth';
import {
  FormioResourceEditComponent,
  FormioResourceService,
  FormioResourceConfig,
  FormioResourceComponent
} from 'angular-formio/resource';
import FormioUtils from 'formiojs/utils';
import { EventsService } from '../../events.service';
import { CamundaRestService } from '../../camunda-rest.service';
import { LoadingController } from '@ionic/angular';
import { FormioService, FormioAppConfig } from 'angular-formio';
import { ResourceService } from '../../resource.service';
import { Formio } from 'formiojs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

declare global {
  interface Window { setLanguage: any; }
}
@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],

})
export class TaskEditComponent implements OnInit, OnDestroy {
  task: any = {};
  submission = {};
  onError = new EventEmitter();
  constructor(
    public service: ResourceService,
    public auth: FormioAuthService,
    public events: EventsService,
    public route: ActivatedRoute,
    public router: Router,
    public config: FormioResourceConfig,
    private eventService: EventsService,
    private camundaService: CamundaRestService,
    private loadingController: LoadingController,
    public translate: TranslateService,
  ) {
    //

  }

  announceRefresh() {
    this.eventService.announceRefresh('refresh');
  }

  onSubmit(submission) {
    this.service
      .save(submission)
      .then((data) => {
        if (!this.task.disabled) {
          this.camundaService.updateExecutionVariables(this.task.executionId, this.task.formKey,
            { value: data._id, type: 'String' }).subscribe(() => {
              console.log(submission);
              if (submission.data.completed === true) {
                this.camundaService.postCompleteTask(this.task.id, {}).subscribe((data1) => {
                  this.events.announceItem({ taskId: this.task.id, complete: true });
                  this.router.navigate(['tasks']);
                });
              } else {
                this.events.announceRefresh('tasks');
              }
            });
        }
      })
      .catch((err) => this.onError.emit(err));
    // console.log(submission);

  }
  ngOnDestroy(): void {
  }
  async presentLoading() {
    const loading = await this.loadingController.create({});
    return await loading.present();
  }
  getTaskExecutionVariable(task) {

  }

  loadResource(id, formKey, resourceName) {
    const route = new ActivatedRoute;
    route.snapshot = new ActivatedRouteSnapshot;
    route.snapshot.params = { id: id };
    return this.service.loadResourceCustom(route, formKey, resourceName);
  }
  updateResource(id) {

  }
  ngOnInit() {
    this.task.id = this.route.snapshot.params.taskId;
    this.task.deleteReason = this.route.snapshot.params.deleteReason;
    this.task.executionId = this.route.snapshot.params.executionId;
    this.task.formKey = this.route.snapshot.params.formKey;
    this.service.initialize();

    if (this.task.executionId !== 'undefined') {
      if (this.task.deleteReason === 'completed') {
        this.task.disabled = true;
        this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(variables => {
          // this.loadingController.dismiss();
          if (variables.length > 0) {
            variables.forEach(element => {
              this.loadResource(element.value, this.task.formKey, 'task').then(data => {
                this.service.resource.data.id = this.task.id;
              }).catch((err) => {
                console.error(err);
              });
            });

          }
        });
      } else {
        this.camundaService.getExecutionVariables(this.task.executionId).subscribe(variables => {
          // this.loadingController.dismiss();
          if (variables.task && variables.task.value != null) {
            console.log(variables.task);
            this.task.new = false;
            this.loadResource(variables.task.value, this.task.formKey, 'task').then(data => {
              this.service.resource.data.id = this.task.id;
            }).catch((err) => {
              this.camundaService.deleteExecutionVariables(this.task.executionId, 'task').subscribe(data => {

              });
              console.error(err);
            });

          } else {
            this.task.new = true;
          }
        });
      }

    } else {
      // this.loadingController.dismiss();

    }
    setTimeout(() => {
      const currentLang = this.translate.currentLang;
      Formio.createForm(document.getElementById('formio'), this.service.form, { language: currentLang }).then(form => {
        form.onSubmit = this.onSubmit(form.submission);
        form.submission = this.service.resource;
        form.disabled = this.task.disabled;
        console.log(this.service.resource);
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
    }, 1300);
  }
}
