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
  auth: any = {
    user: { data: { name: 'Ahmad Arksousi', username: 'ahmad' } }
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


  deleteItem(item) {

    for (let i = 0; i < this.tsks.length; i++) {

      if (this.tsks[i] === item) {
        this.tsks.splice(i, 1);
      }

    }

  }

  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id).subscribe(data => {
      console.log(data);
      filter.count = data.count;
    });
  }
  toggleFilter(item, bool) {
    this.event.announceFilter({ item: item, bool: bool });
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
