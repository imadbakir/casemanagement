import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { isObject } from 'util';

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
    version: [],
    ready: false,
    executionVariables: []
  };
  versionSubmittion = true;
  completeSubmitted = true;
  objectKeys = Object.keys;
  constructor(
    public events: EventsService,
    public route: ActivatedRoute,
    public router: Router,
    private camundaService: CamundaRestService,
    private loadingController: LoadingController,
    private auth: AuthService,
    public translate: TranslateService,
    public location: Location
  ) {
    //

  }

  /**
   * Go Back After Task is completed
   */
  goBack() {
    this.router.navigate(['tasks',
      ...(this.route.parent.snapshot.params.filterId ? [this.route.parent.snapshot.params.filterId] : [])]);

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
            let variables = {};
            if (event.component.properties && event.component.properties['variables']) {
              variables = { variables: (JSON.parse(event.component.properties['variables']) || {}) };
            }
            if (this.task.assignee !== this.auth.getUser().username) {
              this.task.assignee = this.auth.getUser().username;
              this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee }).subscribe(() => {
                this.camundaService.postCompleteTask(this.task.id,
                  variables).subscribe(() => {
                    this.events.announceItem({ taskId: this.task.id, complete: true });
                    this.events.announceFiltersRefresh('refresh');
                  });
              });
            } else {
              this.camundaService.postCompleteTask(this.task.id, variables).subscribe(() => {
                this.events.announceItem({ taskId: this.task.id, complete: true });
                this.events.announceFiltersRefresh('refresh');
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
    if (isObject(submission.version)) {
      return this.camundaService.modifyExecutionVariables(this.task.executionId, {
        modifications:
        {
          ...submission.version
        }
      }).subscribe((data) => {
        this.goBack();
      });
    } else {
      // this.goBack();
    }

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
    this.route.params.subscribe(params => {
      this.form.ready = false;
      this.presentLoading().then(() => {
        this.camundaService.getTask(params.taskId).subscribe((task) => {
          this.task = task;
          if (this.task.executionId !== 'undefined') {
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

              this.camundaService.getVariableInstanceByExecutionId(
                { executionIdIn: this.task.executionId }).subscribe(historyExecutionVariables => {
                  historyExecutionVariables.forEach((variable) => {
                    this.form.executionVariables[variable.name] = variable.value;
                  });
                  this.form.ready = true;
                  this.dismissLoading();
                });

            });

          }
        },
          (err) => {

          });


      });
    });

  }
}
