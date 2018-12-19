import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';


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
  loading: any;
  form = {
    resourceName: '',
    resourceId: '',
    formKey: '',
    readOnly: false
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
  onSubmit(submission) {
  }
  ngOnDestroy(): void {
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({});
    return await this.loading.present();
  }
  async dismissLoading() {
    return await this.loading.dismiss();
  }



  ngOnInit() {
    this.presentLoading().then(() => {
      this.camundaService.getTask(this.route.snapshot.params.taskId).subscribe((task) => {


        this.task = task;
        if (this.task.executionId && this.task.executionId !== 'undefined') {
          const keyResourceArray = this.task.formKey.split(':');
          this.form.formKey = keyResourceArray[0];
          this.form.resourceName = keyResourceArray[1];
          this.camundaService.getExecutionVariables(this.task.executionId).subscribe(executionVariables => {
            this.form.resourceId = executionVariables[this.form.resourceName] ? executionVariables[this.form.resourceName].value : '';
            this.dismissLoading();
            console.log(this.form);
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
                  console.log(taskDefinition[0].$['camunda:formKey']);
                  this.task.formKey = taskDefinition[0].$['camunda:formKey'];
                  const keyResourceArray = this.task.formKey.split(':');
                  this.form.formKey = keyResourceArray[0];
                  this.form.resourceName = keyResourceArray[1];
                  this.form.readOnly = true;
                  this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(executionVariables => {
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
