import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';


/**
 * Task List Item Component
 */
@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  /**
   * Camunda Task Object
   */
  @Input() task;
  route;
  @ViewChild('trigger') input;

  users: any = [];

  constructor(
    public auth: AuthService,
    private loadingController: LoadingController,
    private camundaService: CamundaRestService,
    private event: EventsService,
    private router: Router) { }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    return await loading.present();
  }

  openAssignee() {
    setTimeout(() => {
      if (this.task.assignee) {
        this.input.nativeElement.focus();
        this.task.assignee = null;
      } else {
        this.task.assignee = this.auth.getUser().username;
      }
      this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee });


    }, 100);

  }
  /**
   * Get Edit or History Route
   */
  getRoute() {
    if (this.task.deleteReason === 'completed') {
      return ['view', this.task.id];
    } else {
      return ['edit', this.task.id];
    }
  }


  /**
   * get Priority Class by priority Value
   * @param priority
   */
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
  /**
   * Get Status as string By priority Value
   * @param priority
   */
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
    this.route = this.getRoute();
  }
}
