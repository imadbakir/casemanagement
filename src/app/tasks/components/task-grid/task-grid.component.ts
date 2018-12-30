import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, PopoverController, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { SortOptionsComponent } from '../sort-options/sort-options.component';
import { ActivatedRoute } from '@angular/router';

/**
 * Task List Component
 */
@Component({
  selector: 'app-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss']
})
export class TaskGridComponent implements OnInit {
  /**
   * Filtered Displayed Tasks Array
   */
  tasks: any = [];

  /**
   * Filter object
   */
  filter: any = {
    textSearch: '',
  };

  /**
   * Original Tasks Array
   */
  tasksOrigin: any = [];

  loading;
  /**
   * Chosen FilterId
   */
  filterId = '';
  pageSize = 7;
  /**
   * Infine Scroll View Child
   */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private event: EventsService,
    private camundaService: CamundaRestService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private auth: AuthService,
    private route: ActivatedRoute,
    public loadingController: LoadingController) {

  }

  /**
   * Search Event Callback
   * @param event
   */
  search(event) {
    this.performSearch(this.filter.textSearch);
  }

  /**
   * Present Sort Options Popover Menu.
   * @param event
   */
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

  /**
   * Clear Search Event Callback
   * @param event
   */
  clearSearch(event) {
    this.filter.textSearch = '';
    this.performSearch('');
  }

  /**
   * Perform Text Search on TaskOrigin array and reassign displayed Tasks
   * @param value
   */
  performSearch(value) {
    this.tasks = this.tasksOrigin.filter(function (item) {
      return (item['name'] ? item['name'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['assignee'] ? item['assignee'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['description'] ? item['description'].toString().toLowerCase().includes(value.toLowerCase()) : false) ||
        (item['due'] ? item['due'].toString().toLowerCase().includes(value.toLowerCase()) : false);
    });
  }

  /**
   * Sort Tasks Array
   * @param sorting
   */
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

  /**
   * Set chosen Filter Id
   * @param filterId
   */
  setFilter(filterId) {
    this.filter = filterId;
  }

  /**
   * Fetch Tasks from Camunda API
   * Reset Tasks array if filter is new.
   * Get the Next page if not
   *  @param isNew
   */
  fetchTasks(isNew = false) {
    if (isNew) {
      this.tasks = this.tasksOrigin = [];
    }
    if (this.filter === 'history') {
      return this.presentLoading().then(() => {
        this.camundaService.listHistory({
          firstResult: this.tasks.length,
          maxResults: this.tasks.length + this.pageSize
        }, {
            taskAssignee: this.auth.getUser().username,
            finished: true
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

  /**
   * Ion Infinite Scroll Callback
   * Fetch more tasks then stop spinner.
   * @param infiniteScroll
   */
  DoInfinite(infiniteScroll) {
    this.fetchTasks().then((data) => {
      infiniteScroll.target.complete();
    });
  }

  /**
   * ngOnInit:
   * subscribe to sorting events
   * Subscribe Item Change Events
   * Subscribe to Filter Change Events
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.setFilter(params.filterId);
      this.fetchTasks(true);
    });

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
  }
}
