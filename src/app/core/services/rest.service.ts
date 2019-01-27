import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { EnvService } from './env.service';
import { tap, catchError } from 'rxjs/operators';


/**
 * Camunda Rest API Integration
 */
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private RestUrl = 'http://demo1386417.mockable.io/';


  constructor(private http: HttpClient, private env: EnvService) {

  }

  /**
   * GET User Role Requests
   * @param queryParams
   */
  getUserRequests(queryParams): Observable<any[]> {
    const endpoint = `${this.RestUrl}requests`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  /**
  * GET User Role Requests
  * @param queryParams
  */
  canInitRequest(queryParams): Observable<any[]> {
    const endpoint = `${this.RestUrl}caninit`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }
  /**
   * Error Handler
   * @param operation
   * @param result
   */
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
