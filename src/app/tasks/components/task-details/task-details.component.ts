import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';

/**
 * Task - Form Details Panel
 */
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() panels;
  // tslint:disable-next-line:max-line-length
  task;
  constructor(
    public event: EventsService,
    public router: Router) { }

  /**
   * Toggle FUllscreen Mode
   */
  toggleFullScreen() {
    this.panels.details.fullscreen = !this.panels.details.fullscreen;
  }

  /**
   * ngOnInit:
   * subscribe to ItemChange event to refresh content
   */

  ngOnInit() {
    this.event.itemChange$.subscribe(data => {
      this.task = data;
    });
  }

}
