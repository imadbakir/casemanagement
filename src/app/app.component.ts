import { Component } from '@angular/core';

import { FormioAuthService } from 'angular-formio/auth';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { UserOptionsComponent } from './user-options/user-options.component';
import { PopoverController } from '@ionic/angular';
import { EventsService } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements CanActivate {
  public appPages = [
    { title: 'Tasks', url: '/all-tasks', icon: 'list' },
  ];

  constructor(public eventService: EventsService,
    public popoverCtrl: PopoverController, public auth: FormioAuthService, private router: Router) {
    this.auth.onLogin.subscribe(() => {
      this.router.navigate(['/customer']);
      this.eventService.announceRefresh('refresh');
    });
    this.auth.onLogout.subscribe(() => {
      this.router.navigate(['/auth/login']);
      this.eventService.announceRefresh('refresh');
    });

    this.auth.onRegister.subscribe(() => {
      this.router.navigate(['/customer']);
      this.eventService.announceRefresh('refresh');
    });
  }
  async presentPopover(myEvent) {
    myEvent.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: UserOptionsComponent,
      event: myEvent
    });
    return await popover.present();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.user) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}


