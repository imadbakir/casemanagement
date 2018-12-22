import { NgModule } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
/**
 * Main Bootsrapping Module
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
