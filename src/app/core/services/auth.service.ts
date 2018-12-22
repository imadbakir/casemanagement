import { EventEmitter, Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
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
   *
   * @param object user Object
   * Save user Object to localStorage
   * Emit onLogin Event
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
   * Return true if user object is not null
   */
  isLoggednIn() {
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
