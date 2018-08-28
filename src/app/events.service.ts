import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()


export class EventsService {

  // Observable string sources
  private resizeSource = new BehaviorSubject<object>({});
  private filterSource = new BehaviorSubject<any>({});
  private refreshSource = new Subject<string>();

  // Observable string streams
  refreshAnnounced$ = this.refreshSource.asObservable();
  resizeAnnounced$ = this.resizeSource.asObservable();
  filterAnnounced$ = this.filterSource.asObservable();

  // Service message commands
  announceRefresh(data: string) {
    this.refreshSource.next(data);
  }
  announceResize(item, itemComponent) {
    this.resizeSource.next(item);
    console.log(itemComponent);
  }
  announceFilter(filter) {
    this.filterSource.next(filter);
  }
}
