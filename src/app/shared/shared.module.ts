import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { LanguageComponent } from './components/language/language.component';
import { NotificationsButtonComponent } from './components/notifications-button/notifications-button.component';
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
    NgSelectModule,
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
