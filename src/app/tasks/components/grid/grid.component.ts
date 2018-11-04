import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { Subject } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { FilterService } from '../../../core/services/filter.service';
import { LanguageComponent } from '../../../shared/components/language/language.component';
import { ProcessListComponent } from '../../components/process-list/process-list.component';

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
  static itemChange(item, itemComponent) {
  }
  onResize(item, itemComponent) {
  }


  constructor(public event: EventsService,
    public filterStorage: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public popoverCtrl: PopoverController
  ) {

  }
  async languages(event) {
    const popover = await this.popoverCtrl.create({
      component: LanguageComponent,
      event: event
    });
    return await popover.present();
  }
  async process(event) {
    const popover = await this.popoverCtrl.create({
      component: ProcessListComponent,
      event: event
    });
    return await popover.present();
  }

  changedOptions() {
    if (this.options) {
      this.options.api.optionsChanged();
    }
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
    this.filters = [];
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
  fixPanelsDirection(dir) {
    if (dir === 'rtl') {
      this.panels.tasks.x = this.panels.details.cols;
      this.panels.details.x = 0;
    } else {
      this.panels.details.x = this.panels.tasks.cols;
      this.panels.tasks.x = 0;
    }

    this.changedOptions();
  }
  ngOnInit() {
    this.translate.get('dir').subscribe((data) => {
      this.fixPanelsDirection(data);
    });
    this.translate.onLangChange.subscribe(lang => {
      this.fixPanelsDirection(lang.translations.dir);
    });
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
    /*this.event.filterAnnounced$.subscribe(data => {
      if (data.hasOwnProperty('bool')) {
        if (data.bool) {
          this.addItem(data.item);
        } else {
          this.removeItem(data.item);
        }
      }
    });*/
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
      // this.restoreItems();
      this.panels.details.open = false;
      this.options.api.resize();
    }, 1200);
  }

}
