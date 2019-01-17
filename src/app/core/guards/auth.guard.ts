import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
/**
 * Auth Guard
 */
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
    private router: Router) {
  }

  /**
  * return true if user is loggged in and false if not
   * redirect to login page.
   * @param next
   * @param state
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['auth']);
      return false;
    }
  }
}
