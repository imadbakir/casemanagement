import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EventsService } from '../../events.service';
import { FormioForm } from 'angular-formio';
import { CamundaRestService } from '../../camunda-rest.service';
import { EventEmitter } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() panels;
  @Input() formKey;
  refreshForm = new EventEmitter();
  // tslint:disable-next-line:max-line-length
  task;
  constructor(public event: EventsService, private camundaService: CamundaRestService, public router: Router) { }
  toggleFullScreen() {
    this.panels.details.fullscreen = !this.panels.details.fullscreen;
  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('new')) {
          this.panels.details.fullscreen = true;
          this.panels.details.open = true;
        } else {
          this.panels.details.fullscreen = false;

        }
      }
    });
    this.refreshForm.subscribe();
    this.event.itemChange$.subscribe(data => {
      this.task = data;
    });
  }
  completeTask() {
    // for test
    this.event.announceItem({ taskId: '521b38f1-beaf-11e8-b81f-0eac374867d4', complete: true });
  }
  readOnly() {
    return this.task.deleteReason === 'completed' ? true : false;

  }
  onSubmit(event) {
    if (event.data.complete !== true) {
      this.camundaService.putUpdateTask(this.task.id, event.data).subscribe(data => {
      });
    } else {
      this.task = null;
    }

  }

}
