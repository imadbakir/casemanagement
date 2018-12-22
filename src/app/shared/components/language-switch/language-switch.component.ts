import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from '../language/language.component';

/**
 * Language Button
 */
@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss']
})
export class LanguageSwitchComponent {
  constructor(
    public translate: TranslateService,
    public popoverCtrl: PopoverController
  ) {

  }
  /**
   *
   * @param event Click Event
   * Open Lnaguages Popover Menu
   */
  async languages(event) {
    const popover = await this.popoverCtrl.create({
      component: LanguageComponent,
      event: event
    });
    return await popover.present();
  }

}
