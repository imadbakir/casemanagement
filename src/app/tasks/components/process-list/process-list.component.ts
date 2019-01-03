import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';

/**
 * Process Definitions List Popover Menu
 */
@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})

export class ProcessListComponent {

  public processDefinitions = [];

  constructor(public camundaService: CamundaRestService,
    public router: Router,
    public popoverCtrl: PopoverController) {
    camundaService.getProcessDefinitions({ latestVersion: true }).subscribe((processDefinitions) => {
      this.processDefinitions = processDefinitions;
    });
  }

  /**
   * Navigate to New Process URL
   * @param processDefinitionId
   */
  startProcess(processDefinitionId) {
    this.router.navigate(['tasks', 'new', processDefinitionId]);
    this.popoverCtrl.dismiss();

  }

}
