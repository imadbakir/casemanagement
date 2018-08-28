import { Component, OnInit, EventEmitter } from '@angular/core';
import { ItemSliding, PopoverController, MenuController } from '@ionic/angular';
import { RemoteServiceProvider } from '../remote.service';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { CamundaRestService } from '../camunda-rest.service';
import { Router } from '@angular/router';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../events.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.page.html',
  styleUrls: ['./all-tasks.page.scss'],
})



export class AllTasksPage implements OnInit {
  tsks: any = [];
  filtered: any = [];
  properties: any = ['Name'];
  dataLoaded: Boolean = false;
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
  filterClicked: EventEmitter<String> = new EventEmitter();
  constructor(public popoverCtrl: PopoverController, private remoteService: RemoteServiceProvider, public event: EventsService,
    private camundaService: CamundaRestService, private router: Router, private menu: MenuController, public filterStorage: FilterService) {

  }
  /*performSearch(ev) {
    let val = ev.target.value;
    this.filtered = [];
    this.properties.forEach(element => {
      if (val && val.trim() !== '') {
        let f = this.tasks.filter(function (item) {
          return item[element.toLowerCase()].toLowerCase().includes(val.toLowerCase());
        });
        this.filtered= this.filtered.concat(f);
      }
    });

  }
  cancel(ev) {
    this.filtered = this.tasks.filter(function (item) {
      return item;
    });
  }*/
  async presentPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: TaskOptionsComponent,
      translucent: true,
      event: myEvent
    });
    return await popover.present();
  }
  loadData(event) {

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
  toggleExpand() {
    if (this.panesToggle['end'] && !this.panesToggle['middle'] && !this.panesToggle['start']) {
      this.panesToggle['start'] = true;
      this.panesToggle['middle'] = true;
      this.panesToggle['end'] = true;
    } else {
      this.panesToggle['start'] = false;
      this.panesToggle['middle'] = false;
      this.panesToggle['end'] = true;
    }


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
        value = 'danger';
        break;
      case priority >= 50:
        value = 'warning';
        break;
      case priority >= 25:
        value = 'primary';
        break;
      case priority < 25:
        value = 'secondary';
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
  deleteItem(item) {

    for (let i = 0; i < this.tsks.length; i++) {

      if (this.tsks[i] === item) {
        this.tsks.splice(i, 1);
      }

    }

  }
  clickSlide(itemSlide: ItemSliding) {
    /* if (itemSlide.getSlidingPercent() == 0) {
       // Two calls intentional after examination of vendor.js function
       itemSlide.close();
       itemSlide.moveSliding(-380);
       itemSlide.moveSliding(-380);

       itemSlide.setElementClass('active-options-left', true);
       itemSlide.setElementClass('active-swipe-left', true);
     }
     else {
       itemSlide.close();
     }
     */
  }
  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id).subscribe(data => {
      console.log(data);
      filter.count = data.count;
    });
  }
  toggleFilter(id, bool) {
    this.event.announceFilter({ id: id, bool: bool });
  }
  ngOnInit() {
    this.camundaService.getTasks().subscribe(data => { console.log(data); });
    /*
      this.camundaService.postUserLogin({ username: 'ahmad', password: 'ahmad' }).subscribe(data => {
        console.log(data);
        if (data.status !== 200) {
          if (data.hasOwnProperty('message')) {
            alert(data.message);
          } else {
            alert('Username or password error');
          }
        }
      });
      */
    this.camundaService.getTasks().subscribe(data => {
      this.tsks = data;
      this.tasksOrigin = data;
      this.filtered = data;
      this.dataLoaded = true;
      this.sortArray(this.filter.sortingDirection);
      console.log(this.tsks);
    });
    this.camundaService.getFilters().subscribe(data => {
      this.filters = data;
    });
    /*this.remoteService.getJson('assets/tasks.json')
      .subscribe(data => {
        this.tsks = data;
        this.tasksOrigin = data;
        this.filtered = data;
        this.dataLoaded = true;
        this.sortArray(this.filter.sortingDirection);
        console.log(this.tsks);
      });*/
  }

}
