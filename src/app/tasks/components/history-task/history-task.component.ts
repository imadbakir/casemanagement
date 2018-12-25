import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';

/**
 * History Task Component
 */
@Component({
  selector: 'app-history-task',
  templateUrl: './history-task.component.html',
  styleUrls: ['./history-task.component.scss'],

})
export class HistoryTaskComponent implements OnInit {
  task: any = {};
  loading: any;
  form = {
    resourceName: '',
    resourceId: '',
    formKey: '',
    readOnly: false,
    version: [],
    ready: false
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
                  this.form.ready = true;
                  this.dismissLoading();

                });
            });
          });



        } else {
          alert('this task does not exist!');
          this.dismissLoading();
        }
      });

    },
      (err) => {

      });
  }
}
