import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { ProcessDefinition } from '../schemas/ProcessDefinition';
import { Task } from '../schemas/Task';
import { EnvService } from './env.service';


/**
 * Camunda Rest API Integration
 */
@Injectable({
  providedIn: 'root'
})
export class CamundaRestService {
  private engineRestUrl = this.env.engineRestUrl;
  private engineApiUrl = this.env.engineApiUrl;


  constructor(private http: HttpClient, private env: EnvService) {

  }
  /**
   *
   * @param queryParams
   * GET Tasks With Query Params
   */
  getTasks(queryParams): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  /**
   *
   * @param queryParams query Params
   * Get Filters List
   */
  getFilters(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.engineRestUrl}filter`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched filters`)),
      catchError(this.handleError('getFilters', []))
    );
  }
  /**
   *
   * @param id Filter Id
   * Get Filter by Filter Id
   */
  getFilter(id): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched filter ${id}`)),
      catchError(this.handleError('getFilter', []))
    );
  }
  /**
   *
   * @param variables Post Variables
   * Create new Filter
   */
  createFilter(variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/create`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`created filter`)),
      catchError(this.handleError('createFilter', []))
    );
  }
  /**
   *
   * @param filterId Filter Id
   * @param variables Post Variables
   * Update Filter By FilterId
   */
  updateFilter(filterId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${filterId}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`created filter`)),
      catchError(this.handleError('createFilter', []))
    );
  }
  /**
   *
   * @param filterId Filter Id
   * Delete Filter
   */
  deleteFilter(filterId): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${filterId}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`deleted filter`)),
      catchError(this.handleError('deleteFilter', []))
    );
  }
  /**
   *
   * @param id Filter Id
   * @param queryParams maxResults, firstResult
   */
  listFilter(id, queryParams = {}): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}/list`;
    return this.http.post<any>(endpoint, {}, { params: queryParams }).pipe(
      tap(form => this.log(`fetched filter list ${id}`)),
      catchError(this.handleError('listFilter', []))
    );
  }
  /**
   *
   * @param queryParams
   * Get History Execution Variables
   */
  getVariableInstanceByExecutionId(queryParams = {}) {
    const endpoint = `${this.engineRestUrl}history/variable-instance`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }

  /**
   *
   * @param processDefinitionId
   * Get Process Definition XML
   */
  getProcessDefinitionXML(processDefinitionId) {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/xml`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }

  /**
   *
   * @param queryParams maxResults, firstResult, finished
   * @param variables
   */
  listHistory(queryParams = {}, variables) {
    // tslint:disable-next-line:max-line-length
    const endpoint = `${this.engineRestUrl}history/task`;
    return this.http.post<any>(endpoint, variables, { params: queryParams }).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }
  /**
   * Get Filter Task Count
   */
  getFilterCount(id, variables = {}): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}/count`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`fetched filter ${id} count`)),
      catchError(this.handleError('getFilterCount', []))
    );
  }

  /**
   *
   * @param taskId
   * Get Task Form Key
   */
  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }
  /**
   *
   * @param taskId
   * Get Task Form Variables
   */
  getTaskFormVariables(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched task form variables`)),
      catchError(this.handleError('getTaskFormVariables', []))
    );
  }

  /**
   *
   * @param taskId
   * Get Task
   */
  getTask(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched Task`)),
      catchError(this.handleError('getTask', []))
    );
  }

  /**
   *
   * @param queryParams
   * Get History Task
   */
  getHistoryTask(queryParams = {}): Observable<any> {
    const endpoint = `${this.engineRestUrl}history/task`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched History Task`)),
      catchError(this.handleError('getHistoryTask', []))
    );
  }
  /**
   *
   * @param executionId
   * Get Execution Variables By Execution Id
   */
  getExecutionVariables(executionId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched ExecutionVariables`)),
      catchError(this.handleError('getExecutionVariables', []))
    );
  }
  /**
   *
   * @param executionId
   * @param variables
   * Modify Execution Variables
   */
  modifyExecutionVariables(executionId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }
  /**
   *
   * @param executionId
   * @param variableName
   * @param variables
   * Update Execution Variable by VariableName
   */
  updateExecutionVariables(executionId: String, variableName: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }
  /**
   *
   * @param executionId
   * @param variableName
   * Delete Execution Variable by Variable Name
   */
  deleteExecutionVariables(executionId: String, variableName: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }

  /**
   *
   * @param taskId
   * @param variables
   * Post Complete Task
   */
  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted complete task`)),
      catchError(this.handleError('postCompleteTask', []))
    );
  }

  /**
   *
   * @param taskId
   * @param variables
   * Update Task
   */
  putUpdateTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`put task`)),
      catchError(this.handleError('putUpdateTask', []))
    );
  }

  /**
   *
   * @param taskId
   * @param variables
   * Assign a task to user or Group
   */
  postAssignTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/assignee`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted assign task`)),
      catchError(this.handleError('postAssignTask', []))
    );
  }

  /**
   *
   * @param processDefinitionKey
   * Get Process Definition Start Form By Process Definition Key
   */
  getProcessDefinitionTaskKey(processDefinitionKey): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError('getProcessDeifnitionFormKey', []))
    );
  }
  /**
   * Get Process Definitions list
   * @param queryParams
   */
  getProcessDefinitions(queryParams = {}): Observable<ProcessDefinition[]> {
    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition').pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  /**
   *
   * @param processDefinitionKey
   * @param variables
   * Post Process instance Start
   */
  postProcessInstance(processDefinitionKey, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }


  /**
     *
     * @param processDefinitionId
     * Get Process Definition Start Form By Process Definition Id
     */
  processInstanceStartForm(processDefinitionId): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/startForm`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  /**
     *
     * @param processDefinitionId
     * @param variables
     * Post Process instance Start
     */
  processDefinitionSubmitForm(processDefinitionId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/submit-form`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }
  /**
   *
   * @param userId
   * get User Profile
   */
  getUserProfile(userId): Observable<any> {
    const endpoint = `${this.engineRestUrl}user/${userId}/profile`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('getUserProfile', []))
    );
  }

  /**
   *
   * @param variables
   * User Login - FormData Post
   */
  postUserLogin(variables): Observable<any> {
    const endpoint = `${this.engineApiUrl}admin/auth/user/default/login/welcome`;
    const formData = new URLSearchParams();
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    formData.append('username', variables.username);
    formData.append('password', variables.password);
    return this.http.post(endpoint, formData.toString(), options).pipe(
      tap(data => data),
      catchError(this.handleError('postUserLogin', []))
    );
  }

  /**
   *
   * @param queryParams
   * get user Groups
   */
  getIdentity(queryParams = {}) {
    const endpoint = `${this.engineRestUrl}identity/groups`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('getUserProfile', []))
    );
  }

  /**
   *
   * @param operation
   * @param result
   * Error Handler
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
