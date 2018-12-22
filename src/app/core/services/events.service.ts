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
   * @param data
   * Announce a filters Refresh Event
   */
  announceFiltersRefresh(data: string) {
    this.refreshFiltersSource.next(data);
  }

  /**
   * @param filter
   * Announce Filter Event
   */
  announceFilter(filter) {
    this.filterSource.next(filter);
  }

  /**
   *
   * @param item
   * Announce Task Item Action
   */
  announceItem(item) {
    this.itemSource.next(item);
  }

  /**
   * @param sorting
   * Announce Task Sorting Change
   */
  announceSorting(sorting) {
    this.sortingSource.next(sorting);
  }

}
