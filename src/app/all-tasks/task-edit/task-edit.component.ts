import { Component, OnInit, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
import { FormioService, FormioAppConfig, FormioModule } from 'angular-formio';
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
  @ViewChild('formio') formioElement;
  task: any = {};
  submission = {};
  onError = new EventEmitter();
  formVariables = {};
  objectKeys = Object.keys;
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
    this.camundaService.updateExecutionVariables(this.task.executionId, 'servicerequest',
      { value: submission._id, type: 'String' }).subscribe(() => {
        if (submission.data.completed === true) {
          this.camundaService.postCompleteTask(this.task.id, {}).subscribe((data1) => {
            this.events.announceItem({ taskId: this.task.id, complete: true });
            this.events.announceFiltersRefresh('');
            this.router.navigate(['tasks']);
          });
        } else {
          this.events.announceRefresh('tasks');
        }
      });
    /* if (!this.task.disabled) {
      this.camundaService.updateExecutionVariables(this.task.executionId, 'servicerequest',
        { value: data._id, type: 'String' }).subscribe(() => {
          if (submission.data.completed === true) {
            this.camundaService.postCompleteTask(this.task.id, {}).subscribe((data1) => {
              this.events.announceItem({ taskId: this.task.id, complete: true });
              this.router.navigate(['tasks']);
            });
          } else {
            this.events.announceRefresh('tasks');
          }
        });
    }*/

  }
  ngOnDestroy(): void {
  }
  async presentLoading() {
    const loading = await this.loadingController.create({});
    return await loading.present();
  }



  ngOnInit() {
    this.presentLoading().then(() => {
      this.camundaService.getTask(this.route.snapshot.params.taskId).subscribe((task) => {
        this.task = task;
        if (this.task.executionId && this.task.executionId !== 'undefined') {
          this.camundaService.getTaskFormVariables(this.task.id).subscribe((formVariables) => {
            this.camundaService.getExecutionVariables(this.task.executionId).subscribe(executionVariables => {
              if (formVariables) {
                this.objectKeys(formVariables).forEach(element => {
                  if (executionVariables[formVariables[element].value]) {
                    formVariables[element].resourceId = executionVariables[formVariables[element].value].value;
                  } else {
                    formVariables[element].resourceId = '';
                  }
                  if (this.task.formKey !== element) {
                    formVariables[element].readOnly = true;
                  } else {
                    formVariables[element].readOnly = false;
                  }
                });
                this.formVariables = formVariables;
                this.loadingController.dismiss();
              }
            });
          });

          /* if (this.task.deleteReason === 'completed') {
            this.task.disabled = true;
            this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(variables => {
              // this.loadingController.dismiss();
              if (variables.length > 0) {
                variables.forEach(element => {
                });
              }
            });
          }*/
          // TODO: this.camundaService.postUserLogin({ username: 'imad', password: 'imad' }).subscribe(data => { });
          /*
            formkey = task1
            execution
              R1 : 5
              approve: true
              approveMng: false
            form variables
              task: servicerequest
              task1: r1
          */
          // fill form variables

        } else {
          this.camundaService.getHistoryTask(this.route.snapshot.params.taskId).subscribe(tasks => {
            if (tasks.length > 0) {
              this.task = tasks[0];
              this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(variables => {
                // this.loadingController.dismiss();
                this.formVariables = {
                  task: { type: 'String', value: 'servicerequest', valueInfo: {}, resourceId: '', readOnly: true },
                  task1: { type: 'String', value: 'servicerequest', valueInfo: {}, resourceId: '', readOnly: true }
                };
                if (variables.length > 0) {
                  variables.forEach(element => {
                    if (element.value) {
                      this.formVariables['task'].resourceId = element.value;
                      this.formVariables['task1'].resourceId = element.value;
                    }
                  });

                }
                this.loadingController.dismiss();

              });
            } else {
              alert('this task does not exist!');
              this.loadingController.dismiss();

            }
          });
        }
      },
        (err) => {

        });


    });
  }
}
