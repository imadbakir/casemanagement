import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
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
  constructor(
    public event: EventsService,
    public route: ActivatedRoute,
    public router: Router) {

  }

  /**
   * Toggle FUllscreen Mode
   */
  toggleFullScreen() {
    this.panels.details.fullscreen = !this.panels.details.fullscreen;
  }

  closeTask() {
    this.router.navigate(['tasks', this.route.snapshot.params['filterId']]);
  }

  ngOnInit() {
    if (this.route.children.length > 0) {
      this.panels.details.open = true;
    }
  }

}
