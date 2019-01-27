import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
/**
 * Process Modal - New process instance
 */
@Component({
  selector: 'app-process-modal',
  templateUrl: './process-modal.component.html',
  styleUrls: ['./process-modal.component.scss']
})
export class ProcessModalComponent implements OnInit {

  constructor(public auth: AuthService, public modal: ModalController, public navParams: NavParams,
    public camundaService: CamundaRestService, public event: EventsService) {

  }



  ngOnInit() {
    if (this.navParams.data.processDefinitionId) {
    }
  }

}


