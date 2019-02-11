import { EventEmitter, Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { isArray } from 'util';
const STORAGE_KEY = 'LoggedInUser';
/**
 * Auth Service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  onLogin: EventEmitter<object> = new EventEmitter();
  onLogout: EventEmitter<object> = new EventEmitter();
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
  /**
   * Save user Object to localStorage
   * Emit onLogin Event
   * @param object user Object

   */
  setUser(object) {
    object.token = btoa(object.username + ':' + object.password);
    this.storage.set(STORAGE_KEY, object);
    this.onLogin.emit(object);
  }
  /**
   * Get User Object from LocalStorage
   */
  getUser() {
    return this.storage.get(STORAGE_KEY);
  }

  /**
   * Checks if a user has a role, returns boolean
   */
  hasRole(role) {
    const hasRole = this.getUser().groups.some(function (group) {
      return isArray(role) ?
        this.role.includes(group.id) : group.id === role;
    });
    return hasRole;
  }
  /**
   * Return true if user object is not null
   */
  isLoggedIn() {
    return this.getUser() !== null;
  }
  /**
   * Remove LocalStorage user object
   * Emit onLogout Event
   */
  logout() {
    this.storage.remove(STORAGE_KEY);
    this.onLogout.emit({});
  }
}
