import { Component, OnInit } from '@angular/core';
import { ItemSliding, PopoverController } from '@ionic/angular';
import { RemoteServiceProvider } from '../remote.service';
import { TaskOptionsComponent } from '../task-options/task-options.component';
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
  tasksOrigin: any = [];

  constructor(public popoverCtrl: PopoverController, private remoteService: RemoteServiceProvider) {

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
  performSearch(value) {
    this.tsks = this.tasksOrigin.filter(function (item) {
      return item['name'].toLowerCase().includes(value.toLowerCase()) ||
        item['assignee'].toLowerCase().includes(value.toLowerCase()) ||
        item['description'].toLowerCase().includes(value.toLowerCase()) ||
        item['due'].toLowerCase().includes(value.toLowerCase());
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
  ngOnInit() {
    this.remoteService.getJson('assets/tasks.json')
      .subscribe(data => {
        this.tsks = data;
        this.tasksOrigin = data;
        this.filtered = data;
        this.dataLoaded = true;
        this.sortArray(this.filter.sortingDirection);
        console.log(this.tsks);
      });
  }

}
