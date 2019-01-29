import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


/**
 * External API Service Integration - utilizes Angular HttpClient Request Function
 * to Create a generic Api Call Service for any kind of request - Get, Post, Put, Delete etc..
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalService {


  constructor(private http: HttpClient) {

  }
  /**
   * Returns Observable of http request
   * @param method
   *  Request Method
   * @param url
   *  Request URL
   * @param params
   *  Query Params if GET and Body if Other.
   */
  apiCall(method, url, params = {}) {
    return this.http.request(method, url, { responseType: 'json', body: params });

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      result['status'] = error.status;
      if (error.error.hasOwnProperty('message')) {
        result['message'] = error.error.message;
        result['type'] = error.error.type;

      }

      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
