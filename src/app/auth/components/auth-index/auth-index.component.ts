import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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

  ngOnInit() {

  }
}
