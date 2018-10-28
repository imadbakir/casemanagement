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
    console.log(submission);
    this.camundaService.processDefinitionSubmitForm(this.route.snapshot.params['processDefinitionId'], {}).subscribe(instance => {
      this.camundaService.updateExecutionVariables(instance.id, this.startForm[1],
        { value: submission._id, type: 'String' }).subscribe(() => {
          this.event.announceFiltersRefresh('');
          this.camundaService.updateExecutionVariables(instance.id, 'v_' + this.startForm[0],
            { value: submission._id + ':' + submission._fvid, type: 'String' }).subscribe(() => {
              this.router.navigate(['tasks']);
            });
        });
    });
  }
  ngOnInit() {
    this.camundaService.processInstanceStartForm(this.route.snapshot.params['processDefinitionId']).subscribe(startForm => {
      // startForm.key = 'startrequest:servicerequest';
      this.startForm = startForm.key.split(':');
      // this.router.navigate([`/tasks/new/${processDefinitionId}`]);
    });
  }

}
