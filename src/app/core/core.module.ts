import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormioAuthService } from 'angular-formio/auth';
import { FormioResources } from 'angular-formio/resource';
import { StorageServiceModule } from 'angular-webstorage-service';
import { AppRoutingModule } from './core-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { EnvServiceProvider, FormioAppConfigProvider, formioAuthConfigProvider } from './services/env.service.provider';
import { EventsService } from './services/events.service';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    StorageServiceModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NoopAnimationsModule,
    IonicModule.forRoot({
      mode: 'md',
      backButtonText: '',
      menuType: 'overlay',
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
    FormioResources,
    FormioAuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    formioAuthConfigProvider,
    FormioAppConfigProvider,
  ],
  exports: [
    IonicModule,
    RouterModule
  ],
})
export class CoreModule { }
