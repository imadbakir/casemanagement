import { Component, OnInit } from '@angular/core';
import { FormioResourceConfig, FormioResourceService, FormioResourceIndexComponent } from 'angular-formio/resource';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RemoteServiceProvider } from '../../remote.service';
import { TaskOptionsComponent } from '../../task-options/task-options.component';
import { PopoverController } from '@ionic/angular';
import { KeysPipe } from '../../keys.pipe';
import { IonicModule } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.scss'],
  providers: [KeysPipe]
})
export class TaskIndexComponent extends FormioResourceIndexComponent implements OnInit {
  tsks: any = [];
  filtered: any = [];
  properties: any = ['Name'];
  dataLoaded: Boolean = false;
  subscription: Subscription;
  popoverClick;
  filter: any = {
    createdAt: '',
    dueAt: '',
    sortingProp: { name: 'firstName', type: 'string' },
    sortingDirection: -1,
    textSearch: '',
  };
  tasksOrigin: any = [];

  constructor(public keysPipe: KeysPipe, public popoverCtrl: PopoverController, public remoteService: RemoteServiceProvider,
    public service: FormioResourceService, private eventsService: EventsService,
    config: FormioResourceConfig, public route: ActivatedRoute, public router: Router) {
    super(service, route, router, config);
    this.subscription = eventsService.refreshAnnounced$.subscribe(
      data => {
        this.ngOnInit();
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
  loadData(event) {

  }
  setPopover(event) {
    this.popoverClick = event;
  }
  search() {
    this.performSearch(this.filter.textSearch);
  }
  performSearch(value) {
    if (value.length > 0) {
      this.tsks = this.tasksOrigin.filter(function (item) {
        return item.value.data['firstName'].toLowerCase().includes(value.toLowerCase()) ||
          item.value.data['lastName'].toLowerCase().includes(value.toLowerCase()) ||
          item.value.data['email'].toLowerCase().includes(value.toLowerCase());
      });
    } else {
      this.tsks = this.tasksOrigin;
    }
  }
  setSortingDirection() {
    this.filter.sortingDirection === 1 ? this.filter.sortingDirection = -1 : this.filter.sortingDirection = 1;
    this.sortArray(this.filter.sortingDirection);
  }

  sortArray(dir) {
    const config = this.filter.sortingProp;
    switch (config.type) {
      case 'datetime':
        this.tsks.sort(function (a, b) {
          const dateA = new Date(a.value.data[config.name]), dateB = new Date(b.value.data[config.name]);
          const left = dir === 1 ? dateA : dateB;
          const right = dir === 1 ? dateB : dateA;
          return left.getTime() - right.getTime();
        });
        break;

      case 'number':
        this.tsks.sort(function (a, b) {
          const left = dir === 1 ? a : b;
          const right = dir === 1 ? b : a;
          // tslint:disable-next-line:radix
          return parseInt(left.value.data[config.name]) - parseInt(right.value.data[config.name]);
        });
        break;
      default:
        this.tsks.sort(function (a, b) {
          const valueA = a.value.data[config.name].toLowerCase(), valueB = b.value.data[config.name].toLowerCase();
          if (valueA < valueB) {
            return -1 * dir;
          }
          if (valueA > valueB) {
            return 1 * dir;
          }
          return 0;
        });
    }

  }
  getPriority(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'danger';
        break;
      case priority >= 50:
        value = 'warning';
        break;
      case priority >= 25:
        value = 'primary';
        break;
      case priority < 25:
        value = 'secondary';
        break;



    }
    return value;
  }
  getStatus(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'Critical';
        break;
      case priority >= 50:
        value = 'Important';
        break;
      case priority >= 25:
        value = 'Normal';
        break;
      case priority < 25:
        value = 'Low';
        break;




    }
    return value;
  }
  showDetails(task) {
    task.showDetails ? task.showDetails = false : task.showDetails = true;
  }
  deleteItem(item) {

    for (let i = 0; i < this.tsks.length; i++) {

      if (this.tsks[i] === item) {
        this.tsks.splice(i, 1);
      }

    }

  }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.remoteService.formio(this.service.formFormio.submissionsUrl).subscribe(data => {
        const newData = this.keysPipe.transform(data, ['']);
        this.tsks = newData;
        this.filtered = newData;
        this.tasksOrigin = newData;
        this.dataLoaded = true;
        this.sortArray(this.filter.sortingDirection);
        console.log(this.tsks);
      });

    });
  }
}
