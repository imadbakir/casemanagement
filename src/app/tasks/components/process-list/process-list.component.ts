import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { RestService } from '../../../core/services/rest.service';
import { ProcessModalComponent } from '../process-modal/process-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { slideInRtl, slideIn } from '../../../animations/slide-in';
import { slideOutRtl, slideOut } from '../../../animations/slide-out';

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
    private restService: RestService,
    private auth: AuthService,
    private modalController: ModalController,
    public translate: TranslateService
  ) {
    /* camundaService.getProcessDefinitions({ latestVersion: true }).subscribe((processDefinitions) => {
       this.processDefinitions = processDefinitions;
     }); */
    this.restService.getRequests({ userId: this.auth.getUser().username }).subscribe(processes => {
      this.processDefinitions = processes;
    });
  }

  /**
   * Navigate to New Process URL
   * @param processDefinitionId
   */
  async startProcess(process) {
    const dir = await this.translate.get('dir').toPromise().then(direction => direction);
    const modal = await this.modalController.create({
      enterAnimation: dir === 'rtl' ? slideInRtl : slideIn,
      leaveAnimation: dir === 'rtl' ? slideOutRtl : slideOut,
      cssClass: 'side-modal',
      showBackdrop: true,
      component: ProcessModalComponent,
      componentProps: process
    });
    this.popoverCtrl.dismiss();
    return await modal.present();
    // this.router.navigate(['tasks', 'new', processDefinitionId]);
  }

}
