import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { LanguageComponent } from './components/language/language.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [TranslateModule, IonicModule, CommonModule],
  declarations: [UserOptionsComponent, LanguageComponent],
  entryComponents: [UserOptionsComponent, LanguageComponent],
  exports: [
    TranslateModule,
    UserOptionsComponent,
    LanguageComponent
  ]
})

export class SharedModule { }
