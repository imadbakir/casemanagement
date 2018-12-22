import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { LanguageComponent } from './components/language/language.component';
import { NotificationsButtonComponent } from './components/notifications-button/notifications-button.component';
import { FormsModule } from '@angular/forms';
/**
 * Shared Module
 * imports and exports Shared Modules and declared components
 */
@NgModule({
  imports: [TranslateModule, IonicModule, CommonModule],
  entryComponents: [LanguageComponent, UserOptionsComponent],
  declarations: [UserOptionsComponent, HeaderComponent, LanguageSwitchComponent, LanguageComponent, NotificationsButtonComponent],

  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    UserOptionsComponent,
    HeaderComponent,
    LanguageSwitchComponent,
    LanguageComponent,
    NotificationsButtonComponent
  ]
})

export class SharedModule { }
