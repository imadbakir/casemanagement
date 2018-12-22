import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as _moment from 'moment';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
/**
 * Filter Modal - add - edit Filter
 */
@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  /**
   * All criterias to fill dropdown
   */
  allCriterias = [
    { key: 'active', name: 'Active', type: 'boolean' },
    { key: 'name', name: 'Name', type: 'string' },
    { key: 'nameLike', name: 'Name Like', type: 'string' },
    { key: 'description', name: 'Description', type: 'string' },
    { key: 'descriptionLike', name: 'Description Like', type: 'string' },
    { key: 'priority', name: 'Priority', type: 'number' },
    { key: 'priorityMin', name: 'Priority Min', type: 'number' },
    { key: 'priorityMax', name: 'Priority Max', type: 'number' },
    { key: 'createdBefore', name: 'Created Before', type: 'date' },
    { key: 'createdAfter', name: 'Created After', type: 'date' },
    { key: 'dueBefore', name: 'Due Before', type: 'date' },
    { key: 'dueAfter', name: 'Due After', type: 'date' },
  ];
  /**
   * Currently edited criterias array
   */
  criterias = [];
  /**
   * Filter orQueries Array
   */
  orQueries = [];

  /**
   *Task Collection Enum
   * 1: My Tasks
   * 2: Group Tasks
   * 3: My & Group Tasks
   */
  taskGroup = 1;

  /**
   * Filter Object
   */
  filter = {
    resourceType: 'Task',
    name: '',
    owner: '',
    query: {
      orQueries: []
    },
    properties: {
      color: '',
      description: '',
      priority: ''
    }
  };
  constructor(public auth: AuthService, public modal: ModalController, public navParams: NavParams,
    public camundaService: CamundaRestService, public event: EventsService) {

  }

  /**
   * ngOnInit: Fill filter objects, orQueries & Criterias array if filterId was provided
   */

  ngOnInit() {
    this.filter.owner = this.auth.getUser().username;
    if (this.navParams.data.filterId) {
      this.camundaService.getFilter(this.navParams.data.filterId).subscribe(filter => {
        this.filter = filter;
        this.orQueries = this.filter.query.orQueries;
        this.allCriterias.forEach(element => {
          if (this.filter.query[element.key]) {
            const temp = element;
            temp['value'] = this.filter.query[element.key];
            this.criterias.push(temp);
          }
        });
        if (this.orQueries.length > 1) {
          this.taskGroup = 3;
        } else if (this.orQueries.hasOwnProperty('assignee')) {
          this.taskGroup = 1;
        } else {
          this.taskGroup = 2;
        }
      });
    }
  }

  updateType(event) {
    this.allCriterias.filter(item => {
      if (item.key === event.detail.value) {
        this.criterias.filter(item1 => {
          if (item1.key === event.detail.value) {
            item1.type = item.type;
            item1.value = item1.type === 'boolean' ? true : '';
          }
        });
      }
    });

  }

  /**
   * On Task Collection Dropdown value change update orQueries
   * @param event
   *  ionChange Event
   */
  updateQuery(event) {
    switch (event.detail.value) {
      case '1':
        this.orQueries = [];
        this.orQueries.push({
          assignee: this.auth.getUser().username
        });
        break;
      case '2':
        this.orQueries = [];
        this.orQueries.push({
          candidateGroups: Array.prototype.map.call(this.auth.getUser().groups, function (item) { return item.id; })
        });
        break;
      case '3':
        this.orQueries = [];
        this.orQueries.push({
          assignee: this.auth.getUser().username,
          candidateGroups: Array.prototype.map.call(this.auth.getUser().groups, function (item) { return item.id; })
        });
        break;
    }
  }

  /**
   * Correct Date Type value format to fit with java format and then Create New or update Filter.
   */

  saveFilter() {
    this.criterias.forEach(element => {
      if (element.key.length > 0) {
        this.filter.query[element.key] =
          element.type === 'date' ? _moment(element.value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : element.value;
      }
    });
    this.filter.query['orQueries'] = this.orQueries;
    console.log(this.filter);
    if (this.filter.hasOwnProperty('id')) {
      this.camundaService.updateFilter(this.filter['id'], this.filter).subscribe(() => {
        this.event.announceFiltersRefresh('');
        this.modal.dismiss();
      });
    } else {
      this.camundaService.createFilter(this.filter).subscribe(() => {
        this.event.announceFiltersRefresh('');
        this.modal.dismiss();
      });
    }


  }
}
