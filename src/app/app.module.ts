import { NgModule } from '@angular/core';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TaskOptionsComponent } from './task-options/task-options.component';
import { RemoteServiceProvider } from './remote.service';
import { FormioModule, FormioAppConfig } from 'angular-formio';
import { FormioAuthService, FormioAuthConfig } from 'angular-formio/auth';
import { FormioResources } from 'angular-formio/resource';
import { AuthConfig, AppConfig } from '../config';

import { FormioGrid } from 'angular-formio/grid';
import { UserOptionsComponent } from './user-options/user-options.component';
import { EventsService } from './events.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { BasicAuthInterceptor } from './basic-auth.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageComponent } from './language/language.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, TaskOptionsComponent, UserOptionsComponent, LanguageComponent],
  entryComponents: [TaskOptionsComponent, UserOptionsComponent, LanguageComponent],
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
    FormioModule,
    FormioGrid,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    AuthService,
    AuthGuard,
    EventsService,
    FormioResources,
    FormioAuthService,
    { provide: FormioAuthConfig, useValue: AuthConfig },
    { provide: FormioAppConfig, useValue: AppConfig },
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
