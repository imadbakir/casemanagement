import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { UserOptionsComponent } from '../../../shared/components/user-options/user-options.component';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.scss'],
})



export class FiltersMenuComponent implements OnInit {


  filters = [];
  openFilter = '';

  constructor(
    public popoverCtrl: PopoverController,
    public event: EventsService,
    private camundaService: CamundaRestService,
    public translate: TranslateService,
    public modalController: ModalController,
    public auth: AuthService) {
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
  toggleFilter(item) {
    this.openFilter = item.id;
    this.event.announceFilter({ item: item });
  }

  ngOnInit() {
    this.event.refreshFiltersAnnounced$.subscribe(() => {
      this.camundaService.getFilters({ owner: this.auth.getUser().username }).subscribe((filters) => {
        this.filters = filters;
        if (this.filters.length > 0) {
          const openFilters = this.filters.filter((item) => item.id === this.openFilter);
          if (openFilters.length > 0) {
            this.toggleFilter(openFilters[0]);

          } else if (this.openFilter === 'history') {
            this.toggleFilter({ id: 'history' });
          } else {
            this.toggleFilter(this.filters[0]);

          }
        }
      });
    });

    this.camundaService.getFilters({ owner: this.auth.getUser().username }).subscribe(filters => {
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
}
