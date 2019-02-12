import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as _moment from 'moment';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { RestService } from '../../../core/services/rest.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isArray } from 'util';
/**
 * Filter Modal - add - edit Filter
 */
@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  public branches = [];
  public departments = [];
  public caseTypes = [];
  public caseNames$: Observable<any>;
  public segmentTypes = [];
  public segmentNames$: Observable<any>;
  public beneficiaries = [];
  /**
   * Filter Object
   */
  filter = {
    branches: [],
    departments: [],
    caseTypes: [],
    caseNames: [],
    segmentTypes: [],
    segmentNames: [],
    beneficiaries: []
  };
  constructor(public auth: AuthService, public modal: ModalController, public navParams: NavParams,
    public camundaService: CamundaRestService, public restService: RestService, public event: EventsService, private router: Router) {

  }

  onCaseTypeSelect(value) {
    this.filter.caseNames = [];
    this.caseNames$ = this.restService.getCaseNames({ casetypes: value.map(item => item.id) });
  }
  onSegmentTypeSelect(value) {
    this.filter.segmentNames = [];
    this.segmentNames$ = this.restService.getSegmentNames({ segmentnames: value.map(item => item.id) });
  }
  /**
   * ngOnInit
   */

  ngOnInit() {
    this.restService.getBranches().subscribe(data => this.branches = data);
    this.restService.getDepartments().subscribe(data => this.departments = data);
    this.restService.getCaseTypes().subscribe(data => this.caseTypes = data);
    this.restService.getSegmentTypes().subscribe(data => this.segmentTypes = data);
    this.restService.getBeneficiaries().subscribe(data => this.beneficiaries = data);
  }
  applyFilter() {
    const query = Object.assign({}, this.filter);
    Object.keys(query).forEach((key) => (query[key] == null || !query[key].length) && delete query[key]);
    this.router.navigate(['cases', { ...query }]);
  }

}
