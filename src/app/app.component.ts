import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { AuthService } from './core/services/auth.service';
import { EventsService } from './core/services/events.service';
import { NavController } from '@ionic/angular';

/**
 * Main App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    public eventService: EventsService,
    public auth: AuthService,
    private router: Router,
    private nav: NavController,
    public translate: TranslateService,
    @Inject(LOCAL_STORAGE) private storage: StorageService) {

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
  /**
   * Fix Dom Direction - localization
   * @param dir
   */
  fixDom(dir) {
   /* const columns = document.getElementsByClassName('formio-component-columns');
    const headers = document.getElementsByClassName('header');
    for (let i = 0; i < columns.length; i++) {
      columns[i].setAttribute('dir', dir);
    }
    for (let i = 0; i < headers.length; i++) {
      headers[i].setAttribute('dir', dir);
    } */
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


