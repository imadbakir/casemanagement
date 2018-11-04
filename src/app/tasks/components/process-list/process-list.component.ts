import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProcessDefinition } from '../../../core/schemas/ProcessDefinition';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';

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

  startProcess(processDefinitionId) {
    this.router.navigate([`/tasks/new/${processDefinitionId}`]);
    this.popoverCtrl.dismiss();

    /*  */
  }
  ngOnInit() {
    this.camundaService.getProcessDefinitions().subscribe((processDefinitions) => {
      this.processDefinitions = processDefinitions;
    });
  }

}
