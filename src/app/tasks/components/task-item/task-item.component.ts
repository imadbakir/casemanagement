import { Component, Input, ViewChild } from '@angular/core';
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
export class TaskItemComponent {
  /**
   * Camunda Task Object
   */
  @Input() task;

  @ViewChild('trigger') input;

  users: any = [];

  constructor(
    private loadingController: LoadingController,
    public auth: AuthService,
    private camundaService: CamundaRestService,
    private event: EventsService) { }

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
      this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee }).subscribe(data => {
        // this.event.announceFiltersRefresh('');
      });


    }, 100);

  }
  chooseItem(item) {
    this.event.announceItem(item);
  }

  /**
   *
   * @param priority
   * get Priority Class by priority Value
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
   *
   * @param priority
   * Get Status as string By priority Value
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

}
