import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioResourceService, FormioResourceComponent } from 'angular-formio/resource';
import { FormioAuthService } from 'angular-formio/auth';
import { PopoverController } from '@ionic/angular';
import { TaskOptionsComponent } from '../../task-options/task-options.component';
import { EventsService } from '../../events.service';
@Component({
  selector: 'app-task-resource',
  templateUrl: './task-resource.component.html',
  styleUrls: ['./task-resource.component.scss'],
})
export class TaskResourceComponent extends FormioResourceComponent implements OnInit, OnDestroy {
  constructor(public popoverCtrl: PopoverController, public eventService: EventsService,
    public auth: FormioAuthService, public service: FormioResourceService, public route: ActivatedRoute) {
    super(service, route);
  }
  async presentPopover(myEvent, id) {
    myEvent.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: TaskOptionsComponent,
      componentProps: { id: id },
      event: myEvent
    });
    return await popover.present();
  }
  ngOnInit() {
    super.ngOnInit();
  }
  announceRefresh() {
    this.eventService.announceRefresh('refresh');
  }
  ngOnDestroy(): void {
    this.service.refresh.emit({
      property: 'submission',
      value: this.service.resource
    });
    this.announceRefresh();
  }
}
