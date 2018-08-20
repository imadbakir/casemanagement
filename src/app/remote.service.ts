import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
  providedIn: 'root'
})
export class RemoteServiceProvider {
  constructor(public http: HttpClient) {

  }
  getJson(link): Observable<any> {
    return this.http.get(link)
      .do((Data: Response) => console.log(Data))
      .map((Data: Response) => Data)
      .catch(this.getError);
  }
  formio(link): Observable<any> {
    const token = localStorage.getItem('formioToken');
    return this.http.get(link, { headers: { 'x-jwt-token': token, 'Content-Type': 'application/json' } })
      .do((Data: Response) => console.log(Data))
      .map((Data: Response) => Data)
      .catch(this.getError);
  }

  private getError(error: Response): Observable<any> {
    console.log(error);
    return Observable.throw(error || 'Server Issue');
  }
}
