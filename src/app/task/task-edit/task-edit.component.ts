import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAuthService } from 'angular-formio/auth';
import {
  FormioResourceEditComponent,
  FormioResourceService,
  FormioResourceConfig
} from 'angular-formio/resource';
import FormioUtils from 'formiojs/utils';
import { EventsService } from '../../events.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],

})
export class TaskEditComponent extends FormioResourceEditComponent implements OnInit, OnDestroy {
  onError = new EventEmitter();
  constructor(
    public service: FormioResourceService,
    public auth: FormioAuthService,
    public route: ActivatedRoute,
    public router: Router,
    public config: FormioResourceConfig,
    private eventService: EventsService
  ) {
    super(service, route, router, config);
  }

  announceRefresh() {
    this.eventService.announceRefresh('refresh');
  }

  onSubmit(submission) {
    const component = this;
    this.service
      .save(submission)
      .then(function () {
        component.announceRefresh();
        component.service.refresh.emit({
          property: 'submission',
          value: component.service.resource
        });
        component.router.navigate(['/task']);
        /*  _this.router.navigate(['../'], {
           relativeTo: _this.route
         });
         */
      })
      .catch(function (err) { return component.onError.emit(err); });
  }
  ngOnDestroy(): void {
  }
  ngOnInit() {

  }
}
