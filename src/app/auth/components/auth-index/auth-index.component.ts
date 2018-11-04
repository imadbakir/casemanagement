import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from '../../../shared/components/language/language.component';

@Component({
  selector: 'app-index-login',
  templateUrl: './auth-index.component.html',
  styleUrls: ['./auth-index.component.scss'],
})
export class AuthIndexComponent  implements OnInit {

  constructor(
    public popoverCtrl: PopoverController,
     public translate: TranslateService) {
  }
  async languages(event) {
    const popover = await this.popoverCtrl.create({
      component: LanguageComponent,
      event: event
    });
    return await popover.present();
  }
  ngOnInit() {

  }
}
