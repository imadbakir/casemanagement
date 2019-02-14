import { Component, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FormioLoader } from '../../../form/components/loader/formio.loader';
import { SortOptionsComponent } from '../sort-options/sort-options.component';
import { trigger, transition, style, animate, state } from '@angular/animations';

/**
 * Cases Dashlet
 */
@Component({
  selector: 'app-cases-dashlet',
  templateUrl: './cases-dashlet.component.html',
  styleUrls: ['./cases-dashlet.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('out', style({ transform: 'translateX(110%)', opacity: 0 })),
      transition('*=>in', animate('300ms')),
      transition('*=>out', animate('200ms'))
    ])]
})
export class CasesDashletComponent implements OnInit, OnChanges {

  @Input() data: any = [];
  @Input() pageSize = 10;
  @Input() infinite = false;
  @Input() title: any = '';
  @Output() fetch: Subject<any> = new Subject();
  items = [];
  filterState = 'out';

  filter: any = {
    sortBy: 'created',
    sortOrder: 'desc',
    textSearch: '',
  };


  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    public loader: FormioLoader,
    public loadingController: LoadingController,
    public popoverCtrl: PopoverController,
    public modalController: ModalController
  ) {

  }
  async toggleFilter() {
    this.filterState = this.filterState === 'in' ? 'out' : 'in';
  }
  fetchMore() {
    if (this.infinite) {
      this.fetch.next({ ...this.filter, start: this.items.length, total: this.pageSize });
    } else {
      this.fetch.next(this.filter);

    }
  }
  reset() {
    this.fetchNew();
    this.toggleFilter();
  }
  applyFilter() {
    this.fetchNew();
    this.toggleFilter();
  }
  fetchNew() {
    this.loader.loading = true;
    if (this.infinite) {
      this.fetch.next({ ...this.filter, start: 0, total: this.pageSize });
    } else {
      this.fetch.next(this.filter);
    }
  }

  trackBy(index, item) {
    return item.id;
  }

  /**
   * Ion Infinite Scroll Callback
   * Fetch more tasks then stop spinner.
  * Ion Infinite Scroll disable if no more data.
  */
  infiniteScrollSettings(data) {
    this.infiniteScroll.complete();
    if (data.length < this.pageSize) {
      this.infiniteScroll.disabled = true;
    } else {
      this.infiniteScroll.disabled = false;
    }
  }
  ngOnChanges(changes) {
    if (changes.data.currentValue && changes.data.previousValue) {
      if (this.infinite) {
        console.log(changes);
        this.items = this.items.concat(changes.data.currentValue);
        this.infiniteScrollSettings(changes.data.currentValue);
      } else {
        this.items = changes.data.currentValue;
      }
      this.loader.loading = false;
    }
  }
  /**
   * onInit send data fetch event
   */
  ngOnInit() {
    this.fetchNew();
  }
}
