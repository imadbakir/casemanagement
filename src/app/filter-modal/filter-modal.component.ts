import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ModalController } from '@ionic/angular';
import { CamundaRestService } from '../camunda-rest.service';
import { EventsService } from '../events.service';
import * as _moment from 'moment';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
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
  criterias = [];
  orQueries = [];
  filter = {
    resourceType: 'Task',
    name: '',
    owner: '',
    query: {},
    properties: {
      color: '',
      description: '',
      priority: ''
    }
  };
  constructor(public auth: AuthService, public modal: ModalController,
    public camundaService: CamundaRestService, public event: EventsService) { }

  ngOnInit() {
    this.filter.owner = this.auth.getUser().username;
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
  createFilter() {
    this.criterias.forEach(element => {
      if (element.key.length > 0) {
        this.filter.query[element.key] =
        element.type === 'date' ? _moment(element.value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : element.value;
      }
    });
    this.filter.query['orQueries'] = this.orQueries;
    console.log(this.filter);
    this.camundaService.createFilter(this.filter).subscribe(() => {
      this.event.announceFiltersRefresh('');
      this.modal.dismiss();
    });

  }
}
