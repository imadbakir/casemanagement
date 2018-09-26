import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAuthService } from 'angular-formio/auth';
import {
  FormioResourceCreateComponent,
  FormioResourceService,
  FormioResourceConfig
} from 'angular-formio/resource';
import FormioUtils from 'formiojs/utils';
import { EventsService } from '../../events.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],

})
export class TaskCreateComponent extends FormioResourceCreateComponent implements OnInit, OnDestroy {
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
    super.ngOnInit();



    // Wait for the parent event to be loaded.
    this.service.resources['task'].resourceLoaded.then((event) => {

      // Wait for the contractor form to load.
      this.service.formLoaded.then((form) => {

        // Wait for the current user to be loaded.
        this.auth.userReady.then((user) => {

          // Default the user data inside of the registration form.
          this.service.resource.data.registration = { data: user.data };

          // Tell our form to re-render the submission.
          this.service.refresh.emit({
            property: 'submissions',
            value: this.service.resource
          });
        });
      });
    });
  }
}
