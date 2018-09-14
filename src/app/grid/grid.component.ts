import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../events.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  static resizeSource: EventEmitter<object> = new EventEmitter();
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  previousItem = null;
  static itemChange(item, itemComponent) {
    console.log('itemChanged', item, itemComponent);
  }
  onResize(item, itemComponent) {
    // GridComponent.resizeSource.emit(item);
  }


  constructor(public event: EventsService, public filterStorage: FilterService) {

  }

  changedOptions() {
    this.options.api.optionsChanged();
    alert(1);
  }

  removeItem(filterItem) {
    const temp = this.dashboard.filter(function (item) {
      return item.propName.id === filterItem.id;
    })[0];
    this.dashboard.splice(this.dashboard.indexOf(temp), 1);
   // this.filterStorage.deleteFromLocalStorage(filterItem);
   this.filterStorage.updateAllStorage(this.dashboard);

  }

  addItem(filterItem) {
    let x;
    if (this.previousItem) {
      x = this.previousItem.x + this.previousItem.cols;
    } else {
      x = 0;

    }
    const item = { x: x, y: 0, cols: 2, rows: 2, propName: filterItem };
    this.dashboard.push(item);
    this.previousItem = item;
    // this.filterStorage.storeOnLocalStorage(item);
    this.filterStorage.updateAllStorage(this.dashboard);

  }

  ngOnInit() {
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
      outerMarginTop: 40,
      outerMarginRight: 100,
      outerMarginBottom: 80,
      outerMarginLeft: 100,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      mobileBreakpoint: 640,
      maxCols: 4,
      maxRows: 4,
      maxItemCols: 2,
      minItemCols: 1,
      maxItemRows: 4,
      minItemRows: 2,
      maxItemArea: 2500,
      minItemArea: 1,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: 'move-handle'
      },
      resizable: {
        enabled: true,
        handles: { s: true, e: true, n: true, w: true, se: true, ne: true, sw: true, nw: true }
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    setTimeout(() => {
      this.dashboard = this.filterStorage.getFromLocalStorage();
    }, 1000);
  }

}
