import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';

/**
 * Main Task Component
 */
@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],

})
export class TaskEditComponent implements OnInit {
  task: any = {};
  loading: any;
  form = {
    resourceName: '',
    resourceId: '',
    formKey: '',
    readOnly: false,
    version: []
  };
  objectKeys = Object.keys;
  constructor(
    public events: EventsService,
    public route: ActivatedRoute,
    public router: Router,
    private camundaService: CamundaRestService,
    private loadingController: LoadingController,
    private auth: AuthService,
    public translate: TranslateService,
  ) {
    //

  }

  /**
   * on formio CustomEvent (eg:Complete) callback
   * @param event
   *  CustomEvent
   */
  onCustomEvent(event) {
    try {
      if (event.hasOwnProperty('type')) {
        switch (event.type) {
          case 'complete':
            if (this.task.assignee !== this.auth.getUser().username) {
              this.task.assignee = this.auth.getUser().username;
              this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee }).subscribe(() => {
                this.camundaService.postCompleteTask(this.task.id,
                  { variables: (JSON.parse(event.component.properties['variables']) || {}) }).subscribe(() => {
                    this.events.announceItem({ taskId: this.task.id, complete: true });
                    this.events.announceFiltersRefresh('');
                    this.router.navigate(['tasks']);
                  });
              });
            } else {
              this.camundaService.postCompleteTask(this.task.id,
                { variables: (JSON.parse(event.component.properties['variables']) || {}) }).subscribe(() => {
                  this.events.announceItem({ taskId: this.task.id, complete: true });
                  this.events.announceFiltersRefresh('');
                  this.router.navigate(['tasks']);
                });
            }

            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * On Form Submit Event Callback
   * update execution Variables Set Form Version
   *  @param submission
   *  Submission Object
   */
  onSubmit(submission) {
    this.camundaService.updateExecutionVariables(this.task.executionId, 'v_' + this.task.formKey,
      { value: submission._fvid, type: 'String' }).subscribe(() => {
      });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    return await this.loading.present();
  }
  async dismissLoading() {
    return await this.loading.dismiss();
  }


  /**
   * ngOnInit: on init get Task Details if false get History Task Details
   * get formKey and Resource name
   * get execution variables and fill form versions array and resourceId
   *
   */
  ngOnInit() {
    this.presentLoading().then(() => {
      this.camundaService.getTask(this.route.snapshot.params.taskId).subscribe((task) => {


        this.task = task;
        if (this.task.executionId && this.task.executionId !== 'undefined') {
          const keyResourceArray = this.task.formKey.split(':');
          this.form.formKey = keyResourceArray[0];
          this.form.resourceName = keyResourceArray[1];
          this.camundaService.getExecutionVariables(this.task.executionId).subscribe(executionVariables => {

            Object.keys(executionVariables).forEach((key) => {
              if (key.indexOf('v_') > -1) {
                this.form.version[key.replace('v_', '')] = executionVariables[key].value;
              }
            });

            this.form.resourceId = executionVariables[this.form.resourceName] ? executionVariables[this.form.resourceName].value : '';
            this.dismissLoading();
            console.log(this.form);
          });

        } else {
          this.camundaService.getHistoryTask({ taskId: this.route.snapshot.params.taskId }).subscribe(tasks => {
            if (tasks.length > 0) {
              this.task = tasks[0];

              this.camundaService.getProcessDefinitionXML(this.task.processDefinitionId).subscribe(xml => {
                const parseString = require('xml2js').parseString;
                parseString(xml.bpmn20Xml, (err, result) => {
                  const taskDefinition = result['bpmn:definitions']['bpmn:process'][0]['bpmn:userTask'].filter(item => {
                    return item.$.id === this.task.taskDefinitionKey;
                  });
                  console.log(taskDefinition[0].$['camunda:formKey']);
                  this.task.formKey = taskDefinition[0].$['camunda:formKey'];
                  const keyResourceArray = this.task.formKey.split(':');
                  this.form.formKey = keyResourceArray[0];
                  this.form.resourceName = keyResourceArray[1];
                  this.form.readOnly = true;
                  this.camundaService.
                    getVariableInstanceByExecutionId({ executionIdIn: this.task.executionId }).subscribe(executionVariables => {
                      this.form.version = executionVariables.forEach((variable) => {
                        if (variable.name.indexOf('v_') > -1) {
                          this.form.version[variable.name.replace('v_', '')] = variable.value;
                        }
                      });
                      const resource = executionVariables.filter((variable) => {
                        return variable.name === this.form.resourceName;
                      });
                      this.form.resourceId = (resource && resource.length > 0) ?
                        resource[0].value : '';
                      console.log(resource);
                      console.log(this.form.resourceName);
                      this.dismissLoading();

                    });
                });
              });



            } else {
              alert('this task does not exist!');
              this.dismissLoading();
            }
          });
        }
      },
        (err) => {

        });


    });
  }
}
