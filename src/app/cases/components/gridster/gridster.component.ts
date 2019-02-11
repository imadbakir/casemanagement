import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CompactType, DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';

/**
 * Gridster Grid
 */
@Component({
  selector: 'app-gridster',
  templateUrl: './gridster.component.html',
  styleUrls: ['./gridster.component.scss'],
})
export class GridsterComponent implements OnInit, AfterViewInit {
  options: GridsterConfig;
  panels = {
    tasks: { x: 0, y: 0, cols: 2, rows: 4, filters: [] },
    details: { x: 2, y: 0, cols: 4, rows: 4, fullscreen: false, open: false },
  };
  dir = 'ltr';

  @HostListener('window:focus', ['$event'])

  /**
   * on Window Focus event callback
   * Notify gridster API to resize the grid.
   */
  onFocus(event: any): void {
    window.setTimeout(() => {
      if (this.options.api) {
        this.options.api.resize();
      }
    }, 350);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public popoverCtrl: PopoverController
  ) {

  }

  /**
   * Notify Gridster API of Options Change
   */
  changedOptions() {
    if (this.options && this.options.api) {
      this.options.api.optionsChanged();
    }
  }

  /**
   * Swap Panels according to Direction
   * @param dir
   * Direction - rtl - ltr
   */
  fixPanelsDirection(dir) {
    if (dir === 'rtl') {
      this.dir = dir;
      this.panels.tasks.x = this.panels.details.cols;
      this.panels.details.x = 0;
    } else {
      this.dir = 'ltr';
      this.panels.details.x = this.panels.tasks.cols;
      this.panels.tasks.x = 0;
    }

    this.changedOptions();
  }

  /**
   * On Gridster Item resize callback
   * @param item
   * Gridster Item
   * @param itemComponent
   * Gridster Item Component Interface
   */
  onItemResize(item, itemComponent) {

  }

  /**
   * On Gridster init callback
   * @param girdster
   * Gridster Component
   */
  onInit(girdster) {

  }
  /**
   * ngOnInit: on init assign gridster options
   * subscribe to nav events
   * subscribe to language changes
   */
  ngOnInit() {
    // gridster Config
    this.options = {
      initCallback: this.onInit,
      itemResizeCallback: this.onItemResize,
      gridType: GridType.Fit,
      compactType: CompactType.CompactUpAndLeft,
      margin: 10,
      outerMarginTop: 15,
      outerMarginRight: 20,
      outerMarginBottom: 15,
      outerMarginLeft: 20,
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

    // fix direction for current language
    this.translate.get('dir').subscribe((data) => {
      this.fixPanelsDirection(data);
    });
    // fix direction on  language change
    this.translate.onLangChange.subscribe(lang => {
      this.fixPanelsDirection(lang.translations.dir);
    });
  }

  /**
   * Afer View is init set timeout to resize gridster - Fix for Out of screen problem.
   */
  ngAfterViewInit() {
    window.setTimeout(() => {
      if (this.options.api) {
        this.options.api.resize();
      }
    }, 1000);
  }
}
