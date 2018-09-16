import { Component, OnInit, EventEmitter } from '@angular/core';
import { ItemSliding, PopoverController, MenuController } from '@ionic/angular';
import { RemoteServiceProvider } from '../remote.service';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { CamundaRestService } from '../camunda-rest.service';
import { Router } from '@angular/router';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { EventsService } from '../events.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.page.html',
  styleUrls: ['./all-tasks.page.scss'],
})



export class AllTasksPage implements OnInit {

  auth: any = {
    user: { data: { name: 'Ahmad Arksousi', username: 'ahmad' } }
  };
  filters = [];

  filterClicked: EventEmitter<String> = new EventEmitter();
  constructor(public popoverCtrl: PopoverController, private remoteService: RemoteServiceProvider, public event: EventsService,
    private camundaService: CamundaRestService, private router: Router, private menu: MenuController, public filterStorage: FilterService) {

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
  toggleHistory(item, bool = true) {
    this.event.announceArchive({ archive: true, item: item, bool: bool });
  }
  ngOnInit() {
    this.camundaService.getTasks().subscribe(data => { console.log(data); });
    this.camundaService.getFilters().subscribe(data => {
      this.filters = data;
    });

  }

}
