import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { EventsService } from '../events.service';

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

  constructor(private camundaService: CamundaRestService, private event: EventsService) { }

  openAssignee() {
    setTimeout(() => {
      if (this.task.assignee) {
        this.input.nativeElement.focus();
        this.task.assignee = null;
      } else {
        this.task.assignee = 'ahmad';
      }
      this.camundaService.postAssignTask(this.task.id, { userId: this.task.assignee }).subscribe(data => {
        console.log(data);
      });


    }, 100);

  }
  chooseItem(item) {
    this.event.announceItem(item);
  }
  complete() {
    // this.task.complete = true;
    this.camundaService.postCompleteTask(this.task.id, {}).subscribe(data => {
      console.log(data);
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
