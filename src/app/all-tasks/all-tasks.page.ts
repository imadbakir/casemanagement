import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ItemSliding, PopoverController, MenuController } from '@ionic/angular';
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

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.page.html',
  styleUrls: ['./all-tasks.page.scss'],
})



export class AllTasksPage implements OnInit, OnDestroy {


  filters = [];
  user;
  filterClicked: EventEmitter<String> = new EventEmitter();
  constructor(public popoverCtrl: PopoverController, private remoteService: RemoteServiceProvider, public event: EventsService,
    private camundaService: CamundaRestService, private router: Router, private menu: MenuController, public filterStorage: FilterService
    , public eventService: EventsService, public translate: TranslateService,
    public auth: AuthService,
    public authz: FormioAuthService, public service: FormioResourceService, public route: ActivatedRoute) {
  }



  isStartOpen() {
    return 1;
    /*
    this.menu.isOpen('start').then(function (data) {
     return data;
   });
   */
  }
  async presentPopover(myEvent) {
    myEvent.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: UserOptionsComponent,
      event: myEvent
    });
    return await popover.present();
  }

  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id, {
      assignee: this.user.username,
      firstResult: 0,
      maxResults: 15
    }).subscribe(data => {
      filter.count = data.count;
    });
  }
  toggleFilter(item, bool) {
    this.event.announceFilter({ item: item, bool: bool });
  }
  toggleHistory() {
    this.event.announceArchive({ archive: true, item: '', bool: true });
  }
  ngOnInit() {
    this.user = this.auth.getUser();
    this.camundaService.getTasks().subscribe(data => { console.log(data); });
    this.camundaService.getFilters().subscribe(data => {
      this.filters = data;
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
