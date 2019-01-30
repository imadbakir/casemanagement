import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { RestService } from '../../../core/services/rest.service';
import { Router } from '@angular/router';
/**
 * Process Modal - New process instance
 */
@Component({
  selector: 'app-process-modal',
  templateUrl: './process-modal.component.html',
  styleUrls: ['./process-modal.component.scss']
})
export class ProcessModalComponent implements OnInit {
  selection: any;
  options: any;
  error = false;
  message = '';
  constructor(public auth: AuthService, public modal: ModalController, public navParams: NavParams,
    public camundaService: CamundaRestService, public event: EventsService, private restService: RestService, private router: Router) {

  }

  doStartProcess() {
    this.modal.dismiss().then(() => {
      console.log(this.selection);
      this.router.navigate(['tasks', 'new', this.navParams.data.processDefinitionId, { selection: this.selection }]);
    });
  }
  startProcess() {
    this.restService.canInitRequest(this.selection).subscribe(data => {
      if (data.data) {
        this.error = false;
        this.doStartProcess();
      } else {
        this.error = true;
        this.message = data.message || 'An unknown error occured.';
      }
    });
  }
  ngOnInit() {
    this.restService.getUserSubordinates({ userId: this.auth.getUser().username }).subscribe(data => {
      this.options = data;
    });
    console.log(this.navParams.data);
    if (this.navParams.data.processDefinitionId) {
    }
  }

}


