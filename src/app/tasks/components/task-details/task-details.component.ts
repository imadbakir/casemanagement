import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() panels;

  refreshForm = new EventEmitter();
  // tslint:disable-next-line:max-line-length
  task;
  constructor(
    public event: EventsService,
     public router: Router) { }
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

}
