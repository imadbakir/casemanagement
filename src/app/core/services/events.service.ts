import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * Events Service - Distribute Events among App
 */
@Injectable({
  providedIn: 'root'
})


export class EventsService {

  // Observable string sources
  private refreshFiltersSource = new ReplaySubject<any>(1);
  private itemSource = new ReplaySubject<any>(1);
  private sortingSource = new ReplaySubject<any>(1);

  refreshFiltersAnnounced$ = this.refreshFiltersSource.asObservable();
  itemChange$ = this.itemSource.asObservable();
  sortingAnnounced$ = this.sortingSource.asObservable();

  // Service message commands

  /**
   * Announce a filters Refresh Event
   * @param data
   */
  announceFiltersRefresh(data: string) {
    this.refreshFiltersSource.next(data);
  }

  /**
   * Announce Task Item Action
   * @param item
   */
  announceItem(item) {
    this.itemSource.next(item);
  }

  /**
   * Announce Task Sorting Change
   * @param sorting
   */
  announceSorting(sorting) {
    this.sortingSource.next(sorting);
  }

}
