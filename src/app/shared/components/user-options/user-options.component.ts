import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { EventsService } from '../../../core/services/events.service';

/**
 * User Options Popover Menu.
 */
@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent {

  id = '';

  constructor(public eventService: EventsService, public translate: TranslateService,
    public auth: AuthService, public popoverCtrl: PopoverController, public navParams: NavParams) {
    this.id = this.navParams.data.id;

  }

  close() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Logout User and close Popover.
   */
  logout() {
    this.auth.logout();
    this.popoverCtrl.dismiss();
  }


}
