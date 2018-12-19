import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, PopoverController, InfiniteScroll } from '@ionic/angular';
import { GridsterItem } from 'angular-gridster2';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { SortOptionsComponent } from '../sort-options/sort-options.component';

@Component({
  selector: 'app-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss']
})
export class TaskGridComponent implements OnInit {
  tasks: any = [];

  filter: any = {
    textSearch: '',
  };

  tasksOrigin: any = [];
  loading;
  filterId = '';
  pageSize = 7;
  items: Array<GridsterItem>;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  static itemChange(item, itemComponent) {
  }

  static itemResize(item, itemComponent) {
  }
  constructor(
    private event: EventsService,
    private camundaService: CamundaRestService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private auth: AuthService,
    public loadingController: LoadingController) {

  }


  search(event) {
    this.performSearch(this.filter.textSearch);
  }

  async sortOptions(event) {
    const popover = await this.popoverCtrl.create({
      component: SortOptionsComponent,
      event: event
    });
    return await popover.present();
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({});
    return await this.loading.present();
  }
  async dismissLoading() {
    this.loading.dismiss();
  }

  clearSearch(event) {
    this.filter.textSearch = '';
    this.performSearch('');
  }

  performSearch(value) {
    this.tasks = this.tasksOrigin.filter(function (item) {
      return (item['name'] ? item['name'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['assignee'] ? item['assignee'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['description'] ? item['description'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['due'] ? item['due'].toString().toLowerCase().includes(value.toLowerCase()) : false);
    });
  }

  sortArray(sorting) {
    switch (sorting.type) {
      case 'datetime':
        this.tasks.sort(function (a, b) {
          const dateA = new Date(a[sorting.name]), dateB = new Date(b[sorting.name]);
          const left = sorting.direction === 1 ? dateA : dateB;
          const right = sorting.direction === 1 ? dateB : dateA;
          return left.getTime() - right.getTime();
        });
        break;

      case 'number':
        this.tasks.sort(function (a, b) {
          const left = sorting.direction === 1 ? a : b;
          const right = sorting.direction === 1 ? b : a;
          // tslint:disable-next-line:radix
          return parseInt(left[sorting.name]) - parseInt(right[sorting.name]);
        });
        break;
      default:
        this.tasks.sort(function (a, b) {
          const valueA = a[sorting.name].toLowerCase(), valueB = b[sorting.name].toLowerCase();
          if (valueA < valueB) {
            return -1 * sorting.direction;
          }
          if (valueA > valueB) {
            return 1 * sorting.direction;
          }
          return 0;
        });
    }

  }

  showDetails(task) {
    task.showDetails ? task.showDetails = false : task.showDetails = true;
  }

  removeItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  setFilter(filterId) {
    this.filter = filterId;
  }
  fetchTasks(isNew = false) {
    if (isNew) {
      this.tasks = this.tasksOrigin = [];
    }
    if (this.filter === 'history') {
      return this.presentLoading().then(() => {
        this.camundaService.listHistory({
          firstResult: this.tasks.length,
          maxResults: this.tasks.length + this.pageSize,
          finished: true
        }, {
          taskAssignee: this.auth.getUser().username,
          }).subscribe(data => {
            this.tasksOrigin = [...this.tasks, ...data];
            this.tasks = this.tasksOrigin;
            this.dismissLoading();
          });

      });
    } else {
      return this.presentLoading().then(() => {
        this.camundaService.listFilter(this.filter,
          { firstResult: this.tasks.length, maxResults: this.tasks.length + this.pageSize }).subscribe(data => {
            this.tasksOrigin = [...this.tasks, ...data];
            this.tasks = this.tasksOrigin;
            this.dismissLoading();
          });
      });

    }

  }
  DoInfinite(infiniteScroll) {
    this.fetchTasks().then((data) => {
      console.log(data);
      infiniteScroll.target.complete();
    });
  }

  ngOnInit() {
    this.event.sortingAnnounced$.subscribe(sorting => {
      this.sortArray(sorting);
    });
    this.event.itemChange$.subscribe(data => {
      if (data.complete) {
        this.tasksOrigin.filter(item => {
          if (data.taskId === item.id) {
            item.complete = true;
            this.tasks = this.tasksOrigin;
            setTimeout(() => {
              this.tasksOrigin.splice(this.tasksOrigin.indexOf(item), 1);
              this.tasks = this.tasksOrigin;
            }, 400);
          }
        });
      }
    });
    this.event.filterAnnounced$.subscribe((data) => {
      if (data.item) {
        console.log(data);
        this.setFilter(data.item.id);
        this.fetchTasks(true);
      }
    });
  }
}
