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
 * Case List Component
 */
@Component({
  selector: 'app-case-grid',
  templateUrl: './case-grid.component.html',
  styleUrls: ['./case-grid.component.scss'],
  providers: [FormioLoader]
})
export class CaseGridComponent implements OnInit {
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
   * ngOnInit:
   * subscribe to sorting events
   * Subscribe Item Change Events
   * Subscribe to Filter Change Events
   */
  ngOnInit() {
    this.cases = [
      {
        'id': 1,
        'caseName': 'طلب صرف مكافأة نجاح',
        'department': 'إدارة الأبناء',
        'caseType': 'الخدمات التعليمية',
        'caseDate': '10/02/2019',
        'status': 'تحت المعالجة',
        'beneficiary': 'عبد الله الحربي - من 15 الى 20 - عازب',
        'description': 'مكافأة نجاح من الصف الثالث متوسط'
      },
      {
        'id': 12,
        'caseName': 'طلب إعانة علاجية ',
        'department': 'إدارة التمكين',
        'caseType': 'المساعدة المالية',
        'caseDate': '24/01/2019',
        'status': 'تحت المعالجة',
        'beneficiary': 'ابراهيم العتيبي - من 21 الى 30 - عازب',
        'description': 'دورة تأهيل في النجاره'
      },
      {
        'id': 50,
        'caseName': 'طلب إعانة تهيئة مبتعث',
        'department': 'إدارة الأبناء',
        'caseType': 'الخدمات التعليمية',
        'caseDate': '01/01/2019',
        'status': 'معلق',
        'beneficiary': 'ابراهيم العتيبي - من 21 الى 30 - عازب',
        'description': 'ابتعاث لاكمال الماجستير في جامعة لندن'
      }
    ];
    this.route.params.subscribe(params => {

    });

  }
}
