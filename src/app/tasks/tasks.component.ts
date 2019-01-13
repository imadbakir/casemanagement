import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';
import { UserOptionsComponent } from '../shared/components/user-options/user-options.component';
import { PopoverController } from '@ionic/angular';

/**
 * Tasks Dashlet Main Component
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})



export class TasksComponent {

  constructor(
    public translate: TranslateService,
    public auth: AuthService,
    private popoverCtrl: PopoverController
  ) {
  }

  /**
   * Open User Options Popover.
   * @param event
   * Click Event
   */
  async userOptions(event) {
    event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: UserOptionsComponent,
      event: event
    });
    return await popover.present();
  }

}
