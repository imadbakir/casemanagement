import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  languages = [
    { key: 'ar', lang: 'عربي' },
    { key: 'en', lang: 'English' }
  ];
  constructor(public translate: TranslateService, public popover: PopoverController,
    @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  setLanguage(lang) {
    this.translate.use(lang);
    this.storage.set('language', lang);
    this.popover.dismiss();
  }

  ngOnInit() {

  }

}
