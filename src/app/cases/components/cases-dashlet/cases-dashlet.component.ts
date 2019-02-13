import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EnvService } from '../../../core/services/env.service';
import { EventsService } from '../../../core/services/events.service';
import { RestService } from '../../../core/services/rest.service';
import { FormioLoader } from '../../../form/components/loader/formio.loader';
import { SortOptionsComponent } from '../sort-options/sort-options.component';

/**
 * Permission Table
 */
@Component({
  selector: 'app-cases-dashlet',
  templateUrl: './cases-dashlet.component.html',
  styleUrls: ['./cases-dashlet.component.scss']
})
export class CasesDashletComponent implements OnInit, OnChanges {
  /**
   * Filtered Displayed Tasks Array
   */
  cases: any = [];

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
    private restService: RestService,
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
  }
  trackBy(index, case_) {
    return case_.id;
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
   * Subscribe to param Change Events & load data accordingly
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loader.loading = true;
      this.restService.getCases({ userId: this.auth.getUser().username, ...params }).subscribe(cases => {
        this.cases = cases;
        this.loader.loading = false;
      });
    });

  }
}
