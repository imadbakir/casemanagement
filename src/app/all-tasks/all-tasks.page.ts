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

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.page.html',
  styleUrls: ['./all-tasks.page.scss'],
})



export class AllTasksPage  implements OnInit, OnDestroy {

  auth: any = {
    user: { data: { name: 'Ahmad Arksousi', username: 'ahmad' } }
  };
  filters = [];

  filterClicked: EventEmitter<String> = new EventEmitter();
  constructor(public popoverCtrl: PopoverController, private remoteService: RemoteServiceProvider, public event: EventsService,
    private camundaService: CamundaRestService, private router: Router, private menu: MenuController, public filterStorage: FilterService
    , public eventService: EventsService,
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


  getFilterCount(filter) {
    this.camundaService.getFilterCount(filter.id).subscribe(data => {
      console.log(data);
      filter.count = data.count;
    });
  }
  toggleFilter(item, bool) {
    this.event.announceFilter({ item: item, bool: bool });
  }

  ngOnInit() {
    this.camundaService.getTasks().subscribe(data => { console.log(data); });
    this.camundaService.getFilters().subscribe(data => {
      this.filters = data;
    });

  }
  async presentPopover(myEvent, id) {
    myEvent.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: TaskOptionsComponent,
      componentProps: { id: id },
      event: myEvent
    });
    return await popover.present();
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
