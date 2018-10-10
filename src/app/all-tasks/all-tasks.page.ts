import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ItemSliding, PopoverController, MenuController, ModalController } from '@ionic/angular';
import { RemoteServiceProvider } from '../remote.service';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { CamundaRestService } from '../camunda-rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../events.service';
import { FilterService } from '../filter.service';
import { FormioResourceComponent, FormioResourceService } from 'angular-formio/resource';
import { FormioAuthService } from 'angular-formio/auth';
import { TranslateService } from '@ngx-translate/core';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AuthService } from '../auth.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ProcessListComponent } from '../process-list/process-list.component';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.page.html',
  styleUrls: ['./all-tasks.page.scss'],
})



export class AllTasksPage implements OnInit, OnDestroy {


  filters = [];
  openFilter = '';
  user;
  filterClicked: EventEmitter<String> = new EventEmitter();
  constructor(
    public popoverCtrl: PopoverController,
    private remoteService: RemoteServiceProvider,
    public event: EventsService,
    private camundaService: CamundaRestService,
    private router: Router,
    private menu: MenuController,
    public filterStorage: FilterService,
    public eventService: EventsService,
    public translate: TranslateService,
    public modalController: ModalController,
    public auth: AuthService,
    public authz: FormioAuthService,
    public service: FormioResourceService,
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
          this.toggleFilter(this.filters[0], true);
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
    this.service.refresh.emit({
      property: 'submission',
      value: this.service.resource
    });
    this.announceRefresh();
  }

}
