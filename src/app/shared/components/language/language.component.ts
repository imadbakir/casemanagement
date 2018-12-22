import { Component, Inject } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

/**
 * Language Popover Menu
 */
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {
  /**
   * Available Languages Array
   */
  languages = [
    { key: 'ar', lang: 'عربي' },
    { key: 'en', lang: 'English' }
  ];
  constructor(public translate: TranslateService, public popover: PopoverController,
    @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  /**
   * Set Choosen Language and save it to LocalStorage
   * close popover
   * @param lang
   *  Language Code
   */
  setLanguage(lang) {
    this.translate.use(lang);
    this.storage.set('language', lang);
    this.popover.dismiss();
  }

}
