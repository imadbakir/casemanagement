import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject } from 'util';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';

/**
 * New Process Instance Form - Start Form
 */
@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})

export class ProcessFormComponent {

  form = {
    resourceName: '',
    formKey: '',
    ready: false
  };


  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public camundaService: CamundaRestService
  ) {
    route.params.subscribe(params => {
      this.form.ready = false;
      camundaService.processInstanceStartForm(params.processDefinitionId).subscribe(startForm => {
        const formResourceArray = startForm.key.split(':');
        this.form.formKey = formResourceArray[0];
        this.form.resourceName = formResourceArray[1];
        this.form.ready = true;
      });
    });
  }

  /**
   * On Form Submit start new process instance
   * update execution variables
   * set form version
   * set submissionId
   * @param submission
   *  Submission Object
   */

  onSubmit(submission) {
    let modifications = {};
    if (isObject(submission.version)) {
      modifications = {
        ...submission.version
      };
    }
    modifications[this.form.resourceName] = { value: submission._id, type: 'String' };

    this.camundaService.processDefinitionSubmitForm(this.route.snapshot.params['processDefinitionId'], {}).subscribe(instance => {
      this.camundaService.modifyExecutionVariables(instance.id, { modifications: modifications }).subscribe(() => {
        this.router.navigate(['tasks']);
      });
    });
  }

}
