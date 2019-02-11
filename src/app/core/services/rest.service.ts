import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { EnvService } from './env.service';
import { tap, catchError } from 'rxjs/operators';
import { Permission } from '../schemas/permission';
import { Position } from '../schemas/position';


/**
 * Camunda Rest API Integration
 */
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private RestUrl = 'http://34.207.137.198:8120/';


  constructor(private http: HttpClient, private env: EnvService) {

  }

  /**
   * GET User Role Requests
   * @param queryParams
   */
  getRequests(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}requests`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched requests`)),
      catchError(this.handleError('getRequests', []))
    );
  }

  /**
  * GET User Role Requests
  * @param queryParams
  */
  canInitRequest(queryParams): Observable<any> {
    const endpoint = `${this.RestUrl}caninit`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }
  /**
    * GET User Subordinates
    * @param queryParams
    */
  getUserSubordinates(queryParams): Observable<any> {
    const endpoint = `${this.RestUrl}orphans`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched ubordinates`)),
      catchError(this.handleError('getUserSubordinates', []))
    );
  }

  /**
    * GET Positions
    * @param queryParams
    */
  getPositions(queryParams = {}): Observable<Position[]> {
    const endpoint = `${this.RestUrl}positions`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched positions`)),
      catchError(this.handleError('getPositions', []))
    );
  }

  /**
   * GET Permissions
   * @param queryParams
   */
  getPermissions(queryParams = {}): Observable<Permission[]> {
    const endpoint = `${this.RestUrl}permissions`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched permission`)),
      catchError(this.handleError('getPermissions', []))
    );
  }

  /**
   * Create Permission
   * @param variables
   * @param queryParams
   */
  createPermission(variables, queryParams = {}): Observable<any> {
    const endpoint = `${this.RestUrl}permission`;
    return this.http.post<any>(endpoint, variables, { params: queryParams }).pipe(
      tap(form => this.log(`created permission`)),
      catchError(this.handleError('createPermission', []))
    );
  }

  /**
   * update Permission
   * @param id
   * @param variables
   * @param queryParams
   */
  updatePermission(id, variables, queryParams = {}): Observable<any> {
    const endpoint = `${this.RestUrl}permission/${id}`;
    return this.http.put<any>(endpoint, variables, { params: queryParams }).pipe(
      tap(form => this.log(`updated permission`)),
      catchError(this.handleError('updatePermission', []))
    );
  }
  /**
   * delete Permission
   * @param id
   */
  deletePermission(id): Observable<any> {
    const endpoint = `${this.RestUrl}permission/${id}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`deleted permission`)),
      catchError(this.handleError('deletePermission', []))
    );
  }


  /**
   * GET cases
   * @param queryParams
   */
  getCases(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}cases`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched cases`)),
      catchError(this.handleError('getCases', []))
    );
  }

  /**
   * GET branches
   * @param queryParams
   */
  getBranches(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}branches`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched branches`)),
      catchError(this.handleError('getBranches', []))
    );
  }
  /**
   * GET departments
   * @param queryParams
   */
  getDepartments(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}departments`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched departments`)),
      catchError(this.handleError('getDepartments', []))
    );
  }

  /**
     * GET case Types
     * @param queryParams
     */
  getCaseTypes(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}casetypes`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched casetypes`)),
      catchError(this.handleError('getCaseTypes', []))
    );
  }

  /**
   * GET case Names
   * @param queryParams
   */
  getCaseNames(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}casenames`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched casetypes`)),
      catchError(this.handleError('getCaseNames', []))
    );
  }
  /**
   * GET case Types
   * @param queryParams
   */
  getSegmentTypes(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}segmenttypes`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched segmenttypes`)),
      catchError(this.handleError('getSegmentTypes', []))
    );
  }

  /**
   * GET case Names
   * @param queryParams
   */
  getSegmentNames(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}segmentnames`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched segmentnames`)),
      catchError(this.handleError('getSegmentNames', []))
    );
  }
  /**
   * GET beneficiaries
   * @param queryParams
   */
  getBeneficiaries(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.RestUrl}beneficiaries`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched beneficiaries`)),
      catchError(this.handleError('getBeneficiaries', []))
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
