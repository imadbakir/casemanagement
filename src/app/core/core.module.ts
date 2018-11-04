import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormioAppConfig } from 'angular-formio';
import { FormioAuthConfig, FormioAuthService } from 'angular-formio/auth';
import { FormioResources } from 'angular-formio/resource';
import { StorageServiceModule } from 'angular-webstorage-service';
import { AppConfig, AuthConfig } from './config';
import { AppRoutingModule } from './core-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
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
    AuthService,
    AuthGuard,
    EventsService,
    FormioResources,
    FormioAuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FormioAuthConfig, useValue: AuthConfig },
    { provide: FormioAppConfig, useValue: AppConfig },
  ],
  exports: [
    IonicModule,
    RouterModule
  ],
})
export class CoreModule { }
