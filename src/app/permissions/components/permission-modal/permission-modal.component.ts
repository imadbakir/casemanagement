import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as _moment from 'moment';
import { AuthService } from '../../../core/services/auth.service';
import { EventsService } from '../../../core/services/events.service';
import { RestService } from '../../../core/services/rest.service';
/**
 * Permission Modal - add - edit Permission
 */
@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss']
})
export class PermissionModalComponent implements OnInit {
  requestPermission = { id: null, requestId: null, permission: null, positionId: null, validity: null };
  validities = this.navParams.data.validities || [];
  permissions = this.navParams.data.permissions || [];
  requests = this.navParams.data.requests || [];

  constructor(public auth: AuthService, public modal: ModalController, public navParams: NavParams,
    private restService: RestService, public event: EventsService) {

  }

  /**
   *
   */

  ngOnInit() {
    if (this.navParams.data.requestPermission) {
      this.requestPermission = { ...this.navParams.data.requestPermission };
    }
  }



  savePermission() {
    if (this.requestPermission.id) {
      this.restService.updatePermission(this.requestPermission.id, this.requestPermission).subscribe(data => {
        this.modal.dismiss();

      });
    } else {
      this.restService.createPermission(this.requestPermission).subscribe(data => {
        this.modal.dismiss();
      });
    }
  }
}
