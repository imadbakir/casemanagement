import { Component } from '@angular/core';
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
  sorting = 3;
  /**
   * Sorting options array
   */
  sortings = [
    { sortBy: 'name', sortOrder: 'asc' },
    { sortBy: 'description', sortOrder: 'asc' },
    { sortBy: 'assignee', sortOrder: 'asc' },
    { sortBy: 'created', sortOrder: 'asc' },
    { sortBy: 'dueDate', sortOrder: 'asc' },
    { sortBy: 'priority', sortOrder: 'asc' }
  ];

  constructor(public popoverCtrl: PopoverController, public eventsService: EventsService) {

  }
  /**
   * Set Sorting Direction
   * @param dir
   */
  setSorting(dir) {
    const sorting = this.sortings[this.sorting];
    sorting.sortOrder = dir;
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
