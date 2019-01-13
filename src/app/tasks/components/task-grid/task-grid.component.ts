import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, PopoverController, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { SortOptionsComponent } from '../sort-options/sort-options.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '../../../core/services/env.service';
import { FormioLoader } from '../../../form/components/loader/formio.loader';

/**
 * Task List Component
 */
@Component({
  selector: 'app-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss'],
  providers: [FormioLoader]
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
    sortBy: 'created',
    sortOrder: 'desc',
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
  viewType;
  pageSize = this.env.tasksPageSize;
  /**
   * Infine Scroll View Child
   */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private event: EventsService,
    private camundaService: CamundaRestService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private env: EnvService,
    public loader: FormioLoader,
    public loadingController: LoadingController,
    public popoverCtrl: PopoverController,
    public modalController: ModalController
  ) {

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
   * Set chosen Filter Id
   * @param filterId
   */
  setFilter(filterId) {
    this.filterId = filterId;
  }

  /**
   * Fetch Tasks from Camunda API
   * Reset Tasks array if filter is new.
   * Get the Next page if not
   *  @param isNew
   */
  fetchTasks(isNew = false) {
    if (isNew) {
      this.viewType = this.filterId === 'history' ? 'view' : 'edit';
      this.tasks = this.tasksOrigin = [];
      this.loader.loading = true;
    }
    if (this.filterId === 'history') {
      this.camundaService.listHistory({
        firstResult: this.tasks.length,
        maxResults: this.tasks.length + this.pageSize
      }, {
          taskAssignee: this.auth.getUser().username,
          finished: true,
          sorting: [
            {
              'sortBy': 'endTime',
              'sortOrder': this.filter.sortOrder
            }
          ]
        }).subscribe(data => {
          this.tasksOrigin = [...this.tasks, ...data];
          this.tasks = this.tasksOrigin;
          this.loader.loading = false;
          this.infiniteScrollSettings(data);
        });

    } else {
      this.camundaService.listFilter(this.filterId,
        { firstResult: this.tasks.length, maxResults: this.tasks.length + this.pageSize }, {
          sortBy: this.filter.sortBy,
          sortOrder: this.filter.sortOrder
        }).subscribe(data => {
          this.tasksOrigin = [...this.tasks, ...data];
          this.tasks = this.tasksOrigin;
          this.loader.loading = false;
          this.infiniteScrollSettings(data);
        });

    }

  }
  trackTask(index, task) {
    return task.id;
  }

  /**
   * Ion Infinite Scroll Callback
   * Fetch more tasks then stop spinner.
 * Ion Infinite Scroll disable if no more data.
 */
  infiniteScrollSettings(data) {
    this.infiniteScroll.complete();
    if (data.length < this.pageSize) {
      this.infiniteScroll.disabled = true;
    } else {
      this.infiniteScroll.disabled = false;
    }
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
      this.filter.sortBy = sorting.sortBy;
      this.filter.sortOrder = sorting.sortOrder;
      this.fetchTasks(true);
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
