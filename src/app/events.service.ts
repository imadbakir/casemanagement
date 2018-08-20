import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {

  // Observable string sources
  private refreshSource = new Subject<string>();

  // Observable string streams
  refreshAnnounced$ = this.refreshSource.asObservable();

  // Service message commands
  announceRefresh(data: string) {
    this.refreshSource.next(data);
  }
}
