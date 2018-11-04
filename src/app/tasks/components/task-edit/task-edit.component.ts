import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';


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
  formVariables = {};
  objKeys = [];
  objectKeys = Object.keys;
  constructor(
    public events: EventsService,
    public route: ActivatedRoute,
    public router: Router,
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
