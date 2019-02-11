import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';

/**
 * Task - Form Details Panel
 */
@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export class CaseDetailsComponent implements OnInit {
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

  /**
   * Close Tsak - Mobile
   * navigate back to filter.
   */
  closeTask() {
    this.router.navigate(['tasks', this.route.snapshot.params['filterId']]);
  }

  /**
   * ngOnInit: subscribe to router events
   * default details panel to open if some task is open.
   */
  ngOnInit() {
    if (this.route.children.length > 0) {
      if (this.route.firstChild && this.route.firstChild.snapshot.params['taskId']) {
        this.panels.details.open = true;
      } else {
        this.panels.details.open = false;

      }
    }

    // On Navigation End Set Details panel to Open if URL param taskId exists - for mobile
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.route.firstChild && this.route.firstChild.snapshot.params['taskId']) {
          this.panels.details.open = true;
        } else {
          this.panels.details.open = false;

        }
      }
    });
  }

}
