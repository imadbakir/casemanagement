import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../camunda-rest.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
export class ProcessFormComponent implements OnInit {
  startForm = {};
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public camundaService: CamundaRestService,
    public event: EventsService
  ) { }
  onSubmit(submission) {
    this.camundaService.processDefinitionSubmitForm(this.route.snapshot.params['processDefinitionId'], {}).subscribe(instance => {
      this.camundaService.updateExecutionVariables(instance.id, 'servicerequest',
        { value: submission._id, type: 'String' }).subscribe(() => {
          this.event.announceFiltersRefresh('');
          this.router.navigate(['tasks']);
        });
    });
  }
  ngOnInit() {
    this.camundaService.processInstanceStartForm(this.route.snapshot.params['processDefinitionId']).subscribe(startForm => {
      startForm.key = 'startrequest';
      this.startForm = startForm;
      // this.router.navigate([`/tasks/new/${processDefinitionId}`]);
    });
  }

}
