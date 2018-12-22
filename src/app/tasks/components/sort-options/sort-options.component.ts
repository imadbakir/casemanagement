import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EventsService } from '../../../core/services/events.service';

/**
 * Sorting Options Popovermenu
 */
@Component({
  selector: 'app-sort-options',
  templateUrl: './sort-options.component.html',
  styleUrls: ['./sort-options.component.scss']
})

export class SortOptionsComponent {
  /**
   * Selected Sorting Option Key
   */
  sorting = 0;
  /**
   * Sorting options array
   */
  sortings = [
    { name: 'name', type: 'text', direction: 1 },
    { name: 'description', type: 'text', direction: 1 },
    { name: 'assignee', type: 'text', direction: 1 },
    { name: 'created', type: 'datetime', direction: 1 },
    { name: 'due', type: 'datetime', direction: 1 },
    { name: 'priority', type: 'number', direction: 1 }
  ];
  // TODO: Translate Sorting Options

  constructor(public popoverCtrl: PopoverController, public eventsService: EventsService) {

  }
  /**
   * Set Sorting Direction
   * @param dir
   */
  setSorting(dir) {
    const sorting = this.sortings[this.sorting];
    sorting.direction = dir;
    this.eventsService.announceSorting(sorting);
    this.close();
  }
  /**
   * Close Sorting Options popover Menu.
   */
  close() {
    this.popoverCtrl.dismiss();
  }
}
