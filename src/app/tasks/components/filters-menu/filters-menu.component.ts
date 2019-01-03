import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { UserOptionsComponent } from '../../../shared/components/user-options/user-options.component';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';

/**
 * Filters Sidebar Menu Component
 */
@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.scss'],
})



export class FiltersMenuComponent implements OnInit, OnDestroy {


  filters = [];
  private subscription: Subscription;

  constructor(
    public popoverCtrl: PopoverController,
    public event: EventsService,
    public router: Router,
    public route: ActivatedRoute,
    private camundaService: CamundaRestService,
    public translate: TranslateService,
    public modalController: ModalController,
    public auth: AuthService) {

  }



  /**
   * Open User Options Popover.
   * @param event
   * Click Even
   */
  async userOptions(event) {
    event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: UserOptionsComponent,
      event: event
    });
    return await popover.present();
  }

  /**
   * Open Filter Options Popover.
   * @param event
   *  Click Event
   * @param filterId
   *  Filter Id
   */
  async filterOptions(event, filterId) {
    event.preventDefault();
    event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: FilterOptionsComponent,
      event: event,
      componentProps: { id: filterId }
    });
    return await popover.present();
  }

  /**
   * Open New Filters Modal
   */
  async presentFilter() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      showBackdrop: true,
      backdropDismiss: true,
      animated: true
    });
    return await modal.present();
  }

  /**
   * Get Filter Task Count
   * @param filter
   *  Filter Object
   */
  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id).subscribe(data => {
      filter.count = data.count;
    });
  }
  createDefaultFilter() {
    const filter = {
      resourceType: 'Task',
      name: 'All Tasks',
      owner: this.auth.getUser().username,
      query: {
        orQueries: [
          {
            assignee: this.auth.getUser().username,
            candidateGroups: Array.prototype.map.call(this.auth.getUser().groups, function (item) { return item.id; })
          }
        ]
      },
      properties: {
        color: '',
        description: '',
        priority: ''
      }
    };
    this.camundaService.createFilter(filter).subscribe((data) => {
      this.event.announceFiltersRefresh('refresh');
    });
  }

  openFilter() {
    this.router.navigate(['tasks', this.filters[0].id]);
  }


  /**
   * NgOnIntit: Subscribe to refresh filters event
   * Get All Filters.
   * Create Default filter if no filters exist.
   */
  ngOnInit() {
    this.subscription = this.event.refreshFiltersAnnounced$
      .subscribe((event) => {
        this.camundaService.getFilters({ owner: this.auth.getUser().username }).subscribe((filters) => {
          this.filters = filters;
          if (filters.length === 0) {
            this.createDefaultFilter();
          }
          if (this.route.children.length === 0 && this.filters.length > 0) {
            this.openFilter();
          }
        });
      });
    this.event.announceFiltersRefresh('refresh');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

