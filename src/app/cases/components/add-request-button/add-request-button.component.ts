import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Add Request Button
 */
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
}
