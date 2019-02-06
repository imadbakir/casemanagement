import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatNativeDateModule, MatPaginatorIntl } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MenuComponent } from './components/menu/menu.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { AppRoutingModule } from './core-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { CamundaRestService } from './services/camunda-rest.service';
import { EnvServiceProvider } from './services/env.service.provider';
import { EventsService } from './services/events.service';
import { ExternalService } from './services/external.service';
import { RestService } from './services/rest.service';
import { PaginatorI18n } from './paginator-i18n';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * App Core Module - Essential Modules, Providers and services
 */
@NgModule({
  declarations: [MenuComponent, UserOptionsComponent],
  entryComponents: [UserOptionsComponent],
  imports: [
    StorageServiceModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'md',
      backButtonText: '',
      menuType: 'push',
      backButtonIcon: 'ios-arrow-back'
    }),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })

  ],
  providers: [
    EnvServiceProvider,
    AuthService,
    AuthGuard,
    EventsService,
    CamundaRestService,
    ExternalService,
    RestService,
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    }
  ],
  exports: [
    IonicModule,
    RouterModule,
    MenuComponent
  ],
})
export class CoreModule { }
