import { Component } from '@angular/core';
import { PopoverController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserOptionsComponent } from '../user-options/user-options.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
    public menu = [
        { title: 'Dashboard', path: '/dashboard', icon: 'home' },
        { title: 'Tasks', path: '/tasks', icon: 'list' }
    ];
    constructor(
        public translate: TranslateService,
        public auth: AuthService,
        private popoverCtrl: PopoverController,
        private menuController: MenuController
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
    /**
     * Close Menu - mobile
     */
    closeMenu() {
        this.menuController.close();
    }
}
