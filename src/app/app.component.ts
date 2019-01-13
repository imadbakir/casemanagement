import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { EventsService } from './core/services/events.service';

/**
 * Main App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
  online$: Observable<boolean>;
  toast;
  constructor(
    public eventService: EventsService,
    public auth: AuthService,
    public translate: TranslateService,
    public toastController: ToastController,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
    this.networkStatus();

    this.translate.setDefaultLang('en');
    this.translate.use(this.storage.get('language') || 'en');
    this.auth.onLogin.subscribe(() => {
      this.router.navigate(['tasks']);
      // window.location.href = '/tasks';

    });
    this.auth.onLogout.subscribe(() => {
      this.router.navigate(['auth']);
    });
  }
  async presentNetworkChange(status) {

    if (status) {
      if (this.toast) {
        this.toastController.dismiss();
      }
    } else {
      this.toast = await this.toastController.create({
        message: 'You Are Offline',
        showCloseButton: false,
        position: 'bottom',
        color: 'danger'
      });
      this.toast.present();

    }

  }
  async networkStatus() {
    this.online$.subscribe(value => {
      this.presentNetworkChange(value);
    });
  }
  /**
   * Fix Dom Direction - localization
   * @param dir
   */
  fixDom(dir) {
    document.documentElement.setAttribute('dir', dir);
  }
  /**
   * ngOnInit:
   * Subscribe to Language Change event and Fix The Dom Dir Attribute
   */
  ngOnInit() {
    this.translate.get('dir').subscribe((data) => {
      this.fixDom(data);
    });
    this.translate.onLangChange.subscribe((data) => {
      this.fixDom(data.translations.dir);
    });
  }

}


