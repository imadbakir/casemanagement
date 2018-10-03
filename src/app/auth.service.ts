import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
const STORAGE_KEY = 'LoggedInUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  onLogin: EventEmitter<object> = new EventEmitter();
  onLogout: EventEmitter<object> = new EventEmitter();
  constructor(private myRoute: Router, @Inject(LOCAL_STORAGE) private storage: StorageService) { }
  setUser(object) {
    this.storage.set('LoggedInUser', object);
    this.onLogin.emit(object);
  }
  getUser() {
    return this.storage.get('LoggedInUser');
  }
  isLoggednIn() {
    return this.getUser() !== null;
  }
  logout() {
    this.storage.remove('LoggedInUser');
    this.onLogout.emit({});
  }
}
