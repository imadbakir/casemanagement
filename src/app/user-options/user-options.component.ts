import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { FormioAuthService } from 'angular-formio/auth';
import { EventsService } from '../events.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent implements OnInit {
  id = '';
  constructor(public eventService: EventsService,
    public auth: AuthService, public popoverCtrl: PopoverController, public navParams: NavParams) {
    this.id = this.navParams.data.id;

  }
  close() {
    this.popoverCtrl.dismiss();
  }
  logout() {
    this.auth.logout();
    this.popoverCtrl.dismiss();
    this.eventService.announceRefresh('refresh');
  }
  ngOnInit() {
  }

}
