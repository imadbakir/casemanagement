import { Component } from '@angular/core';

import { FormioAuthService } from 'angular-formio/auth';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { UserOptionsComponent } from './user-options/user-options.component';
import { PopoverController } from '@ionic/angular';
import { EventsService } from './events.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(public eventService: EventsService,
    public popoverCtrl: PopoverController, public auth: AuthService, private router: Router) {
    this.auth.onLogin.subscribe(() => {
      this.router.navigate(['/tasks']);
      this.eventService.announceRefresh('refresh');
    });
    this.auth.onLogout.subscribe(() => {
      this.router.navigate(['/auth/login']);
      this.eventService.announceRefresh('refresh');
    });


  }
}


