import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()


export class EventsService {

  // Observable string sources
  private resizeSource = new BehaviorSubject<object>({});
  private filterSource = new BehaviorSubject<any>({});
  private refreshFiltersSource = new BehaviorSubject<any>({});
  private archiveSoruce = new BehaviorSubject<any>({});
  private itemSource = new BehaviorSubject<any>({});
  private sortingSource = new BehaviorSubject<any>({});
  private menuSource = new BehaviorSubject<any>({});
  // Observable string streams
  resizeAnnounced$ = this.resizeSource.asObservable();
  filterAnnounced$ = this.filterSource.asObservable();
  refreshFiltersAnnounced$ = this.refreshFiltersSource.asObservable();
  archiveAnnounced$ = this.archiveSoruce.asObservable();
  itemChange$ = this.itemSource.asObservable();
  sortingAnnounced$ = this.sortingSource.asObservable();
  menuChangeAnnounced$ = this.menuSource.asObservable();

  // Service message commands

  announceFiltersRefresh(data: string) {
    this.refreshFiltersSource.next(data);
  }
  announceResize(item, itemComponent) {
    this.resizeSource.next(item);
  }
  announceFilter(filter) {
    this.filterSource.next(filter);
  }
  announceArchive(archive) {
    this.archiveSoruce.next(archive);
  }
  announceItem(item) {
    this.itemSource.next(item);
  }
  announceSorting(sorting) {
    this.sortingSource.next(sorting);
  }
  announceMenuChange(change) {
    this.menuSource.next(change);
  }
}
