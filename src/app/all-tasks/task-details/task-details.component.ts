import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EventsService } from '../../events.service';
import { FormioForm } from 'angular-formio';
import { CamundaRestService } from '../../camunda-rest.service';
import { EventEmitter } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BehaviorSubject } from 'rxjs';
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
  constructor(public event: EventsService, private camundaService: CamundaRestService) { }
  toggleFullScreen() {
    this.panels.details.fullscreen = !this.panels.details.fullscreen;
  }
  ngOnInit() {
    this.refreshForm.subscribe();
    this.event.itemChange$.subscribe(data => {
      this.task = data;
    });
  }
  completeTask() {
    this.event.announceItem({ taskId: '521b38f1-beaf-11e8-b81f-0eac374867d4',  complete: true  });
  }
  readOnly() {
    console.log(this.task.deleteReason === 'completed');
    return this.task.deleteReason === 'completed' ? true : false;

  }
  onSubmit(event) {
    if (event.data.complete !== true) {
      this.camundaService.putUpdateTask(this.task.id, event.data).subscribe(data => {
        console.log(data);
      });
    } else {
      this.task = null;
    }

  }

}
