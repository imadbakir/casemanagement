import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../core/services/rest.service';

@Component({
    selector: 'app-case-filter',
    templateUrl: './case-filter.component.html',
    styleUrls: ['./case-filter.component.scss']
})
export class CaseFilterComponent implements OnInit {
    public branches = [];
    public departments = [];
    public caseTypes = [];
    public caseNames = [];
    public segmentTypes = [];
    public segmentNames = [];
    public beneficiaries = [];

    constructor(private restService: RestService) {

    }
    ngOnInit() {
        this.restService.getBranches().subscribe(data => {
            this.branches = data;
        });
        this.restService.getDepartments().subscribe(data => {
            this.departments = data;
        });
        this.restService.getCaseTypes().subscribe(data => {
            this.caseTypes = data;
        });
        this.restService.getCaseNames().subscribe(data => {
            this.caseNames = data;
        });
        this.restService.getSegmentTypes().subscribe(data => {
            this.segmentTypes = data;
        });
        this.restService.getSegmentNames().subscribe(data => {
            this.segmentNames = data;
        });
        this.restService.getBeneficiaries().subscribe(data => {
            this.beneficiaries = data;
        });
    }
}
