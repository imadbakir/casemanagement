import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ProcessListComponent } from '../process-list/process-list.component';

@Component({
    selector: 'app-add-request-button',
    templateUrl: './add-request-button.component.html',
    styleUrls: ['./add-request-button.component.scss']
})
export class AddRequestButtonComponent {
    constructor(
        public translate: TranslateService,
        public popoverCtrl: PopoverController
    ) {

    }
    async process(event) {
        const popover = await this.popoverCtrl.create({
            component: ProcessListComponent,
            event: event
        });
        return await popover.present();
    }
}
