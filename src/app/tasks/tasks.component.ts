import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';
import { CamundaRestService } from '../core/services/camunda-rest.service';
import { EventsService } from '../core/services/events.service';
import { UserOptionsComponent } from '../shared/components/user-options/user-options.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})



export class TasksComponent implements OnInit, OnDestroy {


  filters = [];
  openFilter = '';
  user;

  constructor(
    public popoverCtrl: PopoverController,
    public event: EventsService,
    private camundaService: CamundaRestService,
    public eventService: EventsService,
    public translate: TranslateService,
    public modalController: ModalController,
    public auth: AuthService,
    public route: ActivatedRoute
  ) {
  }




  async userOptions(event) {
    event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: UserOptionsComponent,
      event: event
    });
    return await popover.present();
  }

  async filterOptions(event, filterId) {
    event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: FilterOptionsComponent,
      event: event,
      componentProps: { id: filterId }
    });
    return await popover.present();
  }


  async presentFilter() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      showBackdrop: true,
      backdropDismiss: true,
      animated: true
    });
    return await modal.present();
  }
  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id).subscribe(data => {
      filter.count = data.count;
    });
  }
  toggleFilter(item, bool) {
    this.openFilter = item.id;
    this.event.announceFilter({ item: item, bool: bool });
  }
  toggleHistory() {
    this.openFilter = 'history';
    this.event.announceArchive({ archive: true, item: '', bool: true });
  }
  ngOnInit() {
    this.user = this.auth.getUser();
    this.event.refreshFiltersAnnounced$.subscribe(() => {
      this.camundaService.getFilters(this.auth.getUser().username).subscribe(filters => {
        this.filters = filters;
        if (this.filters.length > 0) {
          if (this.openFilter.length > 0 && this.openFilter !== 'history') {
            this.toggleFilter(this.filters.filter((item) => item.id === this.openFilter)[0], true);

          } else if (this.openFilter === 'history') {
            this.toggleHistory();
          } else {
            this.toggleFilter(this.filters[0], true);

          }
        }
      });
    });

    this.camundaService.getFilters(this.auth.getUser().username).subscribe(filters => {
      this.filters = filters;
      if (filters.length === 0) {
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
          this.event.announceFiltersRefresh('');
        });
      }
    });

  }

  announceRefresh() {
    this.eventService.announceRefresh('refresh');
  }
  ngOnDestroy(): void {
    this.announceRefresh();
  }

}
