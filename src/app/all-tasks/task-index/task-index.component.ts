import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormioResourceConfig, FormioResourceService, FormioResourceIndexComponent } from 'angular-formio/resource';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RemoteServiceProvider } from '../../remote.service';
import { TaskOptionsComponent } from '../../task-options/task-options.component';
import { PopoverController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.scss'],
})
export class TaskIndexComponent extends FormioResourceIndexComponent implements OnInit {

  constructor(public remoteService: RemoteServiceProvider,
    public service: FormioResourceService, private eventsService: EventsService, ref: ChangeDetectorRef,
    config: FormioResourceConfig, public route: ActivatedRoute, public router: Router) {
    super(service, route, router, config);

  }


  ngOnInit() {
  }

}
