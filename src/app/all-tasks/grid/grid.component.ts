import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../../events.service';
import { FilterService } from '../../filter.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  filterEvent: Subject<any> = new Subject();
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  panels = {
    tasks: { x: 0, y: 0, cols: 2, rows: 4, filters: [] },
    details: { x: 2, y: 0, cols: 4, rows: 4, fullscreen: false, open: false },
  };
  filters = [];
  previousItem = null;
  formKey = '';
  static itemChange(item, itemComponent) {
    console.log('itemChanged', item, itemComponent);
  }
  onResize(item, itemComponent) {
  }


  constructor(public event: EventsService,
    public filterStorage: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService) {

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');
    translate.get('dir').subscribe(data => {
      const dir = data;
      this.fixDom(dir);
    });
  }
  setLanguage(lang) {
    this.translate.use(lang);
    let dir = 'ltr';
    this.translate.get('dir').subscribe(data => {
      dir = data;
      document.documentElement.setAttribute('dir', data);

      const tasksX = this.panels.tasks.x;
      if (dir === 'rtl') {
        this.panels.tasks.x = this.panels.details.cols;
        this.panels.details.x = 0;
      } else {
        this.panels.details.x = this.panels.tasks.cols;
        this.panels.tasks.x = 0;
      }

      this.options.api.optionsChanged();
      this.fixDom(dir);
    });

    /*
     directions.array.forEach(element => {
       element.setAttribute('dir', dir);
     });
     */
  }
  fixDom(dir) {
    const columns = document.getElementsByClassName('formio-component-columns');
    const choices = document.getElementsByClassName('choices');
    const headers = document.getElementsByClassName('header');
    for (let i = 0; i < columns.length; i++) {
      columns[i].setAttribute('dir', dir);
    }
    for (let i = 0; i < choices.length; i++) {
      choices[i].setAttribute('dir', dir);
    }
    for (let i = 0; i < headers.length; i++) {
      headers[i].setAttribute('dir', dir);
    }
  }
  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(filterItem) {
    const temp = this.filters.filter(function (item) {
      return item.id === filterItem.id;
    })[0];
    this.filters.splice(this.filters.indexOf(temp), 1);
    this.filterEvent.next({ item: filterItem, bool: false });
    this.filters = [].concat(this.filters);
    // this.filterStorage.deleteFromLocalStorage(filterItem);
    this.panels.tasks.filters = this.filters;
    this.filterStorage.updateAllStorage(this.panels);

  }

  addItem(filterItem) {
    this.filters.push(filterItem);
    // this.filterStorage.storeOnLocalStorage(item);
    /* this.panels.tasks = { x: this.panels.tasks.x, y: this.panels.tasks.y,
      cols: this.panels.tasks.cols, rows: this.panels.tasks.rows, filters: this.panels.tasks.filters };
      */
    this.filters = [].concat(this.filters);
    this.filterEvent.next({ item: filterItem, bool: true });
    this.panels.tasks.filters = this.filters;

    this.filterStorage.updateAllStorage(this.panels);

  }
  restoreItems() {
    this.filters = this.panels.tasks.filters;
    this.filters.forEach(item => this.filterEvent.next({ item: item, bool: true }));

  }

  ngOnInit() {
    this.event.refreshAnnounced$.subscribe(data => {
      // this.restoreItems();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.route.firstChild && this.route.firstChild.snapshot.params['taskId']) {
          this.panels.details.open = true;
        } else {
          this.panels.details.open = false;

        }
      }
    });
    this.event.filterAnnounced$.subscribe(data => {
      if (data.hasOwnProperty('bool')) {
        if (data.bool) {
          this.addItem(data.item);
        } else {
          this.removeItem(data.item);
        }
      }
    });
    this.options = {
      itemResizeCallback: this.onResize,
      gridType: GridType.Fit,
      compactType: CompactType.CompactUpAndLeft,
      margin: 10,
      outerMarginTop: 0,
      outerMarginRight: 0,
      outerMarginBottom: 0,
      outerMarginLeft: 0,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      mobileBreakpoint: 740,
      maxCols: 6,
      maxRows: 4,
      maxItemCols: 4,
      minItemCols: 2,
      maxItemRows: 4,
      minItemRows: 4,
      maxItemArea: 2500,
      minItemArea: 1,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: 'move-handle'
      },
      resizable: {
        enabled: true,
        handles: { s: false, e: true, n: false, w: true, se: false, ne: false, sw: false, nw: false }
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushResizeItems: true,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    setTimeout(() => {
      // tslint:disable-next-line:max-line-length
      this.filterStorage.getFromLocalStorage() ? this.panels = this.filterStorage.getFromLocalStorage() : this.filterStorage.updateAllStorage(this.panels);
      this.restoreItems();
      this.panels.details.open = false;
      this.options.api.resize();
    }, 1200);
  }

}
