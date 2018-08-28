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
  }

  removeItem(id) {
    const temp = this.dashboard.filter(function (item) {
      return item.propName === id;
    })[0];
    this.dashboard.splice(this.dashboard.indexOf(temp), 1);
    this.filterStorage.deleteFromLocalStorage(temp);
  }

  addItem(id) {
    let x;
    if (this.previousItem) {
      x = this.previousItem.x + this.previousItem.cols;
    } else {
      x = 0;

    }
    const item = { x: x, y: 0, cols: 2, rows: 2, propName: id };
    this.dashboard.push(item);
    this.previousItem = item;
    this.filterStorage.storeOnLocalStorage(item);

  }

  ngOnInit() {
    this.event.filterAnnounced$.subscribe(data => {
      if (data.hasOwnProperty('bool')) {
        if (data.bool) {
          this.addItem(data.id);
        } else {
          this.removeItem(data.id);
        }
      }
    });
    this.options = {
      itemResizeCallback: this.onResize,
      gridType: GridType.HorizontalFixed,
      compactType: CompactType.CompactUpAndLeft,
      margin: 10,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      mobileBreakpoint: 640,
      maxCols: 100,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 2,
      maxItemRows: 100,
      minItemRows: 2,
      maxItemArea: 2500,
      minItemArea: 1,
      fixedColHeight: 250,
      fixedColWidth: 250,
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
      disablePushOnDrag: true,
      disablePushOnResize: false,
      pushDirections: { north: false, east: true, south: false, west: true },
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
