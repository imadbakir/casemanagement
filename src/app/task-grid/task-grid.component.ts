import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../events.service';
import { GridComponent } from '../grid/grid.component';
import { CamundaRestService } from '../camunda-rest.service';
import { ModalController } from '@ionic/angular';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss']
})
export class TaskGridComponent implements OnInit, AfterViewChecked {
  @Input() filterId;
  tsks: any = [];
  filtered: any = [];
  properties: any = ['Name'];
  dataLoaded: Boolean = false;
  currentFilter: any = {
    id: ''
  };
  filter: any = {
    createdAt: '',
    dueAt: '',
    sortingProp: { name: 'priority', type: 'number' },
    sortingDirection: -1,
    textSearch: '',
  };
  filters = [];
  tasksOrigin: any = [];
  panesToggle = {
    start: true,
    middle: true,
    end: true,
    toggleHack: false
  };
  chosenTask;
  subOptions: GridsterConfig;
  items: Array<GridsterItem>;
  static itemChange(item, itemComponent) {
    console.log('itemChanged', item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.log('itemResized', item, itemComponent);
  }
  constructor(private event: EventsService, private camundaService: CamundaRestService, public modalController: ModalController) {

  }

  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: { filterId: this.filterId }
    });
    return await modal.present();
  }
  search() {
    this.performSearch(this.filter.textSearch);
  }
  chooseTask(task) {
    this.chosenTask = task;
  }
  toggleMenu(item) {
    // this.menu.toggle();
    this.panesToggle[item] = !this.panesToggle[item];

    if (!this.panesToggle['end'] && !this.panesToggle['middle']) {
      if (item === 'middle') {
        this.panesToggle['middle'] = true;
        this.panesToggle['end'] = true;

      } else {
        this.panesToggle['middle'] = true;

      }
    }

  }
  toggleExpand(item) {
    if (item.x < 5) {
      item.x = 5;

    } else {
      item.x = 2;

    }
  }
  removeFilter() {
    this.event.announceFilter({ id: this.filterId, bool: false });
  }
  toggleHack(event) {
    console.log(event);
    if (event.detail.visible === true) {
      this.panesToggle['start'] = true;
      this.panesToggle['toggleHack'] = true;
    } else {
      this.panesToggle['start'] = false;
      this.panesToggle['toggleHack'] = false;
    }

  }
  isStartOpen() {
    return 1;
    /*
    this.menu.isOpen('start').then(function (data) {
     return data;
   });
   */
  }
  performSearch(value) {
    this.tsks = this.tasksOrigin.filter(function (item) {
      return (item['name'] ? item['name'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['assignee'] ? item['assignee'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['description'] ? item['description'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['due'] ? item['due'].toString().toLowerCase().includes(value.toLowerCase()) : false);
    });
  }
  setSortingDirection() {
    this.filter.sortingDirection === 1 ? this.filter.sortingDirection = -1 : this.filter.sortingDirection = 1;
    this.sortArray(this.filter.sortingDirection);
  }

  sortArray(dir) {
    const config = this.filter.sortingProp;
    switch (config.type) {
      case 'datetime':
        this.tsks.sort(function (a, b) {
          const dateA = new Date(a[config.name]), dateB = new Date(b[config.name]);
          const left = dir === 1 ? dateA : dateB;
          const right = dir === 1 ? dateB : dateA;
          return left.getTime() - right.getTime();
        });
        break;

      case 'number':
        this.tsks.sort(function (a, b) {
          const left = dir === 1 ? a : b;
          const right = dir === 1 ? b : a;
          // tslint:disable-next-line:radix
          return parseInt(left[config.name]) - parseInt(right[config.name]);
        });
        break;
      default:
        this.tsks.sort(function (a, b) {
          const valueA = a[config.name].toLowerCase(), valueB = b[config.name].toLowerCase();
          if (valueA < valueB) {
            return -1 * dir;
          }
          if (valueA > valueB) {
            return 1 * dir;
          }
          return 0;
        });
    }

  }
  getPriority(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'app-bg-danger';
        break;
      case priority >= 50:
        value = 'app-bg-warning';
        break;
      case priority >= 25:
        value = 'app-bg-primary';
        break;
      case priority < 25:
        value = '';
        break;



    }
    return value;
  }
  getStatus(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'Critical';
        break;
      case priority >= 50:
        value = 'Important';
        break;
      case priority >= 25:
        value = 'Normal';
        break;
      case priority < 25:
        value = 'Low';
        break;




    }
    return value;
  }
  showDetails(task) {
    task.showDetails ? task.showDetails = false : task.showDetails = true;
  }

  removeItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  ListFilter() {
    if (this.filterId) {
      this.camundaService.listFilter(this.filterId).subscribe(data => {
        this.tasksOrigin = data;
        this.tsks = data;
      });

    }
  }
  ngOnInit() {
    this.ListFilter();
  }
  ngAfterViewChecked() {
    this.resizeAllGridItems();
  }

  onResize(event) {
    this.resizeAllGridItems();
  }

  resizeGridItem(item) {
    const grid = document.getElementsByClassName('flex-container')[0];
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'), 10);
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'), 10);
    const rowSpan = Math.ceil((item.querySelector('.card').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
  }

  resizeAllGridItems() {
    const allItems = document.getElementsByClassName('flex-item');
    for (let x = 0; x < allItems.length; x++) {
      this.resizeGridItem(allItems[x]);
    }
  }

}
