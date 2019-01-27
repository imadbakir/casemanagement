import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { RestService } from '../../../core/services/rest.service';
import { ProcessModalComponent } from '../process-modal/process-modal.component';

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

  constructor(
    public popoverCtrl: PopoverController,
    private camundaService: CamundaRestService,
    private router: Router,
    private restService: RestService,
    private auth: AuthService,
    private modalController: ModalController
  ) {
    /* camundaService.getProcessDefinitions({ latestVersion: true }).subscribe((processDefinitions) => {
       this.processDefinitions = processDefinitions;
     }); */
    this.restService.getUserRequests({ userId: this.auth.getUser().username }).subscribe(processes => {
      this.processDefinitions = processes;
    });
  }

  /**
   * Navigate to New Process URL
   * @param processDefinitionId
   */
  async startProcess(process) {
    const modal = await this.modalController.create({
      component: ProcessModalComponent,
      componentProps: process
    });
    this.popoverCtrl.dismiss();
    return await modal.present();
    // this.router.navigate(['tasks', 'new', processDefinitionId]);
  }

}
