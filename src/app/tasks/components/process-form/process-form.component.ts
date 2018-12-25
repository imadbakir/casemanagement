import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';

/**
 * New Process Instance Form - Start Form
 */
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

  /**
   * On Form Submit start new process instance
   * update execution variables
   * set form version
   * set submissionId
   * @param submission
   *  Submission Object
   */

  onSubmit(submission) {
    this.camundaService.processDefinitionSubmitForm(this.route.snapshot.params['processDefinitionId'], {}).subscribe(instance => {
      this.camundaService.updateExecutionVariables(instance.id, this.startForm[1],
        { value: submission._id, type: 'String' }).subscribe(() => {
          this.event.announceFiltersRefresh('');
          this.camundaService.updateExecutionVariables(instance.id, 'v_' + this.startForm[0],
            { value: submission._fvid, type: 'String' }).subscribe(() => {
              this.router.navigate(['tasks']);
            });
        });
    });
  }

  /**
   * ngOnInit: get process start form key & resource name by processDefinitionId
   */
  ngOnInit() {
    this.camundaService.processInstanceStartForm(this.route.snapshot.params['processDefinitionId']).subscribe(startForm => {
      this.startForm = startForm.key.split(':');
    });
  }

}
