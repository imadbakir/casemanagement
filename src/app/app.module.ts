import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TasksComponent } from './tasks/tasks.component';
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


@NgModule({
  declarations: [AppComponent, TaskOptionsComponent, UserOptionsComponent],
  entryComponents: [TaskOptionsComponent, UserOptionsComponent],
  imports: [
    StorageServiceModule,
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md',
      backButtonText: '',
      iconMode: 'ios',
      pageTransition: 'ios-transition',
      menuType: 'overlay',
      backButtonIcon: 'ios-arrow-back'
    }),
    AppRoutingModule,
    FormioModule,
    FormioGrid

  ],
  providers: [
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
