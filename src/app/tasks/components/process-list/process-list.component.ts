import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProcessDefinition } from '../../../core/schemas/ProcessDefinition';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';

/**
 * Process Definitions List Popover Menu
 */
@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})

export class ProcessListComponent implements OnInit {

  processDefinitions: ProcessDefinition[] = [];

  constructor(public camundaService: CamundaRestService,
    public router: Router,
    public event: EventsService,
    public popoverCtrl: PopoverController) { }

  /**
   * Navigate to New Process URL
   * @param processDefinitionId
   */
  startProcess(processDefinitionId) {
    this.router.navigate([`/tasks/new/${processDefinitionId}`]);
    this.popoverCtrl.dismiss();

  }

  /**
   * ngOnInit: Get Process Definitions
   */
  ngOnInit() {
    this.camundaService.getProcessDefinitions({ latestVersion: true }).subscribe((processDefinitions) => {
      this.processDefinitions = processDefinitions;
    });
  }

}
