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
   * ngOnInit: check if task or start form and switch to
   * fullscreen if startForm - workaround
   * subscribe to ItemChange event to refresh content
   */

  ngOnInit() {

    // TODO: Find a better way to do this.

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
    this.event.itemChange$.subscribe(data => {
      this.task = data;
    });
  }

}
