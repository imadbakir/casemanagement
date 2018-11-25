import { Component, OnDestroy, OnInit } from '@angular/core';
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
  loading: any;
  form = {
    resourceName: '',
    resourceId: '',
    formKey: ''
  };
  objectKeys = Object.keys;
  constructor(
    public events: EventsService,
    public route: ActivatedRoute,
    public router: Router,
    private camundaService: CamundaRestService,
    private loadingController: LoadingController,
    public translate: TranslateService,
  ) {
    //

  }



  onSubmit(submission) {
    console.log(submission);
    this.camundaService.updateExecutionVariables(this.task.executionId, this.form.resourceName,
      { value: submission._id, type: 'String' }).subscribe(() => {
        this.camundaService.updateExecutionVariables(this.task.executionId, 'v_' + this.task.formKey,
          { value: submission._id + ':' + submission._fvid, type: 'String' }).subscribe(() => {
            if (submission.data.completed === true) {
              this.events.announceItem({ taskId: this.task.id, complete: true });
              this.events.announceFiltersRefresh('');
              this.router.navigate(['tasks']);
            }
          });
      });
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
        const keyResourceArray = this.task.formKey.split(':');
        this.form.formKey = keyResourceArray[0];
        this.form.resourceName = keyResourceArray[1];

        if (this.task.executionId && this.task.executionId !== 'undefined') {
          this.camundaService.getExecutionVariables(this.task.executionId).subscribe(executionVariables => {
            this.form.resourceId = executionVariables[this.form.resourceName] ? executionVariables[this.form.resourceName].value : '';
            this.dismissLoading();
            console.log(this.form);
          });

        } else {
          this.camundaService.getHistoryTask(this.route.snapshot.params.taskId).subscribe(tasks => {
            if (tasks.length > 0) {
              this.task = tasks[0];
              this.camundaService.getVariableInstanceByExecutionId(this.task.executionId).subscribe(executionVariables => {
                console.log(executionVariables);
                this.dismissLoading();

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
