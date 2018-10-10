import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CamundaRestService } from '../../camunda-rest.service';
import { EventsService } from '../../events.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  @Input() task;
  @Input() formKey;
  @Output() destoy = new EventEmitter();
  @ViewChild('trigger') input;
  users: any = [
    { name: 'ahmad', username: 'ahmad' },
    { name: 'eihab', username: 'eihab' },
    { name: 'imad', username: 'imad' }
  ];

  constructor(private loadingController: LoadingController, private router: Router, public auth: AuthService,
    private camundaService: CamundaRestService, private event: EventsService) { }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    return await loading.present();
  }
  getTaskExecutionVariable(task) {

  }
  openTask(task) {
    this.presentLoading();
    this.camundaService.getTask(task.id).subscribe(data => {

      if (data.executionId != null) {
        this.router.navigate(['/tasks/edit'], {
          queryParams: { formKey: task.formKey, executionId: task.executionId }
        });
        /* return this.camundaService.getExecutionVariables(data.executionId).subscribe(variables => {
           this.loadingController.dismiss();
           const resources = variables.resources;
           if (resources) {
             if (task.deleteReason === 'completed') {
               this.router.navigateByUrl(`/tasks/${resources.task}/view`, {
                 queryParams: { formKey: task.formKey, executionId: task.executionId }
               });
             } else {
               this.router.navigateByUrl(`/tasks/${resources.task}/edit`, {
                 queryParams: { formKey: task.formKey, executionId: task.executionId }
               });
             }
           } else {
             this.router.navigate([`/tasks/new`], { queryParams: { formKey: task.formKey, executionId: task.executionId } });
           }
         }); */
      }
    });


  }
  openAssignee() {
    setTimeout(() => {
      if (this.task.assignee) {
        this.input.nativeElement.focus();
        this.task.assignee = null;
      } else {
        this.task.assignee = this.auth.getUser().username;
      }
      this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee }).subscribe(data => {
        this.event.announceFiltersRefresh('');
      });


    }, 100);

  }
  chooseItem(item) {
    this.event.announceItem(item);
  }
  complete() {
    // this.task.complete = true;
    this.camundaService.postCompleteTask(this.task.id, {}).subscribe(data => {
      this.task.complete = true;
      setTimeout(() => {
        this.destoy.emit();
      }, 200);
    });
  }
  getPriority(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'app-bg-danger';
        break;
      case priority >= 50:
        value = 'app-bg-warning';
        break;
      case priority >= 25:
        value = 'app-bg-primary';
        break;
      case priority < 25:
        value = '';
        break;



    }
    return value;
  }
  getStatus(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'Critical';
        break;
      case priority >= 50:
        value = 'Important';
        break;
      case priority >= 25:
        value = 'Normal';
        break;
      case priority < 25:
        value = 'Low';
        break;




    }
    return value;
  }
  ngOnInit() {
  }

}
