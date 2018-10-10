import { Component, OnInit } from '@angular/core';
import { FormioAuthComponent, FormioAuthService } from 'angular-formio/auth';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { LanguageComponent } from '../../language/language.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-index-login',
  templateUrl: './auth-index.component.html',
  styleUrls: ['./auth-index.component.scss'],
})
export class AuthIndexComponent extends FormioAuthComponent implements OnInit {

  constructor(public service: FormioAuthService, public _route: Router,
    public popoverCtrl: PopoverController, public translate: TranslateService) {
    super();
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
