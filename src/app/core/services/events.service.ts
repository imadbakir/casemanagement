import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Events Service - Distribute Events among App
 */
@Injectable()


export class EventsService {

  // Observable string sources
  private filterSource = new BehaviorSubject<any>({});
  private refreshFiltersSource = new BehaviorSubject<any>({});
  private itemSource = new BehaviorSubject<any>({});
  private sortingSource = new BehaviorSubject<any>({});

  filterAnnounced$ = this.filterSource.asObservable();
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
   * Announce Filter Event
   * @param filter
   */
  announceFilter(filter) {
    this.filterSource.next(filter);
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
