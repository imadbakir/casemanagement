import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { LanguageComponent } from './components/language/language.component';
import { NotificationsButtonComponent } from './components/notifications-button/notifications-button.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HasRoleDirective } from './directives/has-role.directive';
import { OnCreateDirective } from './directives/on-create.directive';

/**
 * Shared Module
 * imports and exports Shared Modules and declared components
 */
@NgModule({
  imports: [TranslateModule, IonicModule, CommonModule, RouterModule],
  entryComponents: [LanguageComponent],
  declarations: [HeaderComponent,
    LanguageSwitchComponent, LanguageComponent, NotificationsButtonComponent, HasRoleDirective, OnCreateDirective],

  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    LanguageSwitchComponent,
    LanguageComponent,
    NotificationsButtonComponent,
    HasRoleDirective,
    OnCreateDirective
  ]
})

export class SharedModule { }
