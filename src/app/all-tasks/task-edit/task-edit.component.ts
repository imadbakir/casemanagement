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
  objKeys = [];
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
    console.log(submission);
    this.camundaService.updateExecutionVariables(this.task.executionId, this.formVariables[this.task.formKey].value,
      { value: submission._id, type: 'String' }).subscribe(() => {
        this.camundaService.updateExecutionVariables(this.task.executionId, 'v_' + this.task.formKey,
          { value: submission._id + ':' + submission._fvid, type: 'String' }).subscribe(() => {
            if (submission.data.completed === true) {
              /* this.camundaService.postCompleteTask(this.task.id,
                {
                  variables:
                  {
                    temporal: { value: true },
                    rejected: { value: true },
                  }
                }
              ).subscribe((data1) => {
                this.events.announceItem({ taskId: this.task.id, complete: true });
                this.events.announceFiltersRefresh('');
                this.router.navigate(['tasks']);
              });*/
              this.events.announceItem({ taskId: this.task.id, complete: true });
              this.events.announceFiltersRefresh('');
              this.router.navigate(['tasks']);
            } else {
              this.events.announceRefresh('tasks');
            }
          });
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
                this.objKeys = this.objectKeys(formVariables);
                this.objKeys = this.objKeys.filter((s) => {
                  // tslint:disable-next-line:no-bitwise
                  return ~s.indexOf('form');
                });
                this.objKeys.sort((a, b) => {
                  const aArray = formVariables[a].value.split(':');
                  const bArray = formVariables[b].value.split(':');
                  return (parseInt(aArray[1] ? aArray[1] : 100, 10)) - (parseInt(bArray[1] ? bArray[1] : 100, 10));
                });
                console.log(this.objKeys);

                for (let i = 0; i < this.objKeys.length; i++) {
                  formVariables[this.objKeys[i]].value = formVariables[this.objKeys[i]].value.split(':')[0];
                  if (executionVariables['v_' + this.objKeys[i]]) {
                    const versionResourceArray = executionVariables['v_' + this.objKeys[i]].value.split(':');
                    formVariables[this.objKeys[i]].version = versionResourceArray[1];
                  }
                  if (executionVariables[formVariables[this.objKeys[i]].value]) {
                    formVariables[this.objKeys[i]].resourceId = executionVariables[formVariables[this.objKeys[i]].value].value;
                  } else {
                    formVariables[this.objKeys[i]].resourceId = '';
                  }
                  if (this.task.formKey !== this.objKeys[i]) {
                    formVariables[this.objKeys[i]].readOnly = true;
                  } else {
                    formVariables[this.objKeys[i]].readOnly = false;
                  }
                }
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
              this.camundaService.getProcessDefinitionXML(this.task.processDefinitionId).subscribe(xml => {
                // this.loadingController.dismiss();
                const parseString = require('xml2js').parseString;

                parseString(xml.bpmn20Xml, (err, result) => {
                  const taskDefinition = result['bpmn:definitions']['bpmn:process'][0]['bpmn:userTask'].filter(item => {
                    return item.$.id === this.task.taskDefinitionKey;
                  });
                  const fields = taskDefinition[0]['bpmn:extensionElements'][0]['camunda:formData'][0]['camunda:formField'];
                  const formVariables = {};
                  fields.forEach(element => {
                    formVariables[element.$.id] = { value: element.$.defaultValue };
                  });
                  this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(executionVariables => {
                    if (formVariables) {
                      this.objKeys = this.objectKeys(formVariables);
                      this.objKeys = this.objKeys.filter((s) => {
                        // tslint:disable-next-line:no-bitwise
                        return ~s.indexOf('form');
                      });
                      this.objKeys.sort((a, b) => {
                        const aArray = formVariables[a].value.split(':');
                        const bArray = formVariables[b].value.split(':');
                        return (parseInt(aArray[1] ? aArray[1] : 100, 10)) - (parseInt(bArray[1] ? bArray[1] : 100, 10));
                      });
                      console.log(this.objKeys);

                      for (let i = 0; i < this.objKeys.length; i++) {
                        formVariables[this.objKeys[i]].value = formVariables[this.objKeys[i]].value.split(':')[0];
                        executionVariables.filter(item => {
                          if (item.name === 'v_' + this.objKeys[i]) {
                            const versionResourceArray = item.value.split(':');
                            formVariables[this.objKeys[i]].version = versionResourceArray[1];
                          }
                          if (item.name === formVariables[this.objKeys[i]].value) {
                            formVariables[this.objKeys[i]].resourceId = item.value;
                          }
                          formVariables[this.objKeys[i]].readOnly = true;

                        });
                      }
                      this.formVariables = formVariables;

                    }
                  });
                });
                /* this.formVariables = {
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

              }*/
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
