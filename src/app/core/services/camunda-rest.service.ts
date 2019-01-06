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
   * GET Tasks With Query Params
   * @param queryParams
   */
  getTasks(queryParams): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  /**
   * Get Filters List
   * @param queryParams query Params
   */
  getFilters(queryParams = {}): Observable<any[]> {
    const endpoint = `${this.engineRestUrl}filter`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched filters`)),
      catchError(this.handleError('getFilters', []))
    );
  }
  /**
   * Get Filter by Filter Id
   * @param id Filter Id
   */
  getFilter(id): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched filter ${id}`)),
      catchError(this.handleError('getFilter', []))
    );
  }
  /**
   * Create new Filter
   * @param variables Post Variables
   */
  createFilter(variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/create`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`created filter`)),
      catchError(this.handleError('createFilter', []))
    );
  }
  /**
   * Update Filter By FilterId
   * @param filterId Filter Id
   * @param variables Post Variables
   */
  updateFilter(filterId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${filterId}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`Updated filter`)),
      catchError(this.handleError('updateFilter', []))
    );
  }
  /**
   * Delete Filter
   * @param filterId
   * Filter Id
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
   * @param id
   * Filter Id
   * @param queryParams
   * maxResults, firstResult
   */
  listFilter(id, queryParams = {}, variables = {}): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}/list`;
    return this.http.post<any>(endpoint, variables, { params: queryParams }).pipe(
      tap(form => this.log(`fetched filter task list ${id}`)),
      catchError(this.handleError('listFilter', []))
    );
  }
  /**
   * Get History Execution Variables
   * @param queryParams
   */
  getVariableInstanceByExecutionId(queryParams = {}) {
    const endpoint = `${this.engineRestUrl}history/variable-instance`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched history variable instances`)),
      catchError(this.handleError('getVariableInstanceByExecutionId', []))
    );
  }

  /**
   * Get Process Definition XML
   * @param processDefinitionId
   */
  getProcessDefinitionXML(processDefinitionId) {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/xml`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched process definition XML`)),
      catchError(this.handleError('getProcessDefinitionXML', []))
    );
  }

  /**
   *
   * @param queryParams
   * maxResults, firstResult, finished
   * @param variables
   */
  listHistory(queryParams = {}, variables = {}) {
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
   * Get Task Form Key
   * @param taskId
   */
  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }
  /**
   * Get Task Form Variables
   * @param taskId
   */
  getTaskFormVariables(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched task form variables`)),
      catchError(this.handleError('getTaskFormVariables', []))
    );
  }

  /**
   * Get Task
   * @param taskId
   */
  getTask(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched Task`)),
      catchError(this.handleError('getTask', []))
    );
  }

  /**
   * Get History Task
   * @param queryParams
   */
  getHistoryTask(queryParams = {}): Observable<any> {
    const endpoint = `${this.engineRestUrl}history/task`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(form => this.log(`fetched History Task`)),
      catchError(this.handleError('getHistoryTask', []))
    );
  }
  /**
   * Get Execution Variables By Execution Id
   * @param executionId
   */
  getExecutionVariables(executionId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched ExecutionVariables`)),
      catchError(this.handleError('getExecutionVariables', []))
    );
  }
  /**
   * Modify Execution Variables
   * @param executionId
   * @param variables
   */
  modifyExecutionVariables(executionId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`Modified ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }
  /**
   * Update Execution Variable by VariableName
   * @param executionId
   * @param variableName
   * @param variables
   */
  updateExecutionVariables(executionId: String, variableName: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`Updated ExecutionVariable`)),
      catchError(this.handleError('updateExecutionVariables', []))
    );
  }
  /**
   * Delete Execution Variable by Variable Name
   * @param executionId
   * @param variableName
   */
  deleteExecutionVariables(executionId: String, variableName: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`Deleted ExecutionVariables`)),
      catchError(this.handleError('deleteExecutionVariables', []))
    );
  }

  /**
   * Post Complete Task
   * @param taskId
   * @param variables
   */
  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`Completed task`)),
      catchError(this.handleError('postCompleteTask', []))
    );
  }

  /**
   * Update Task
   * @param taskId
   * @param variables
   */
  putUpdateTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`Put task`)),
      catchError(this.handleError('putUpdateTask', []))
    );
  }

  /**
   * Assign a task to user or Group
   * @param taskId
   * @param variables
   */
  postAssignTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/assignee`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`{Posted assign task`)),
      catchError(this.handleError('postAssignTask', []))
    );
  }

  /**
   * Get Process Definition Start Form By Process Definition Key
   * @param processDefinitionKey
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
    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition', { params: queryParams }).pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  /**
   * Post Process instance Start
   * @param processDefinitionKey
   * @param variables
   */
  postProcessInstance(processDefinitionKey, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance Start`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }


  /**
     * Get Process Definition Start Form By Process Definition Id
     * @param processDefinitionId
     */
  processInstanceStartForm(processDefinitionId): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/startForm`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance Start Form`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  /**
     * Post Process instance Start
     * @param processDefinitionId
     * @param variables
     */
  processDefinitionSubmitForm(processDefinitionId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/submit-form`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`Posted process instance Form`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }
  /**
   * get User Profile
   * @param userId
   */
  getUserProfile(userId): Observable<any> {
    const endpoint = `${this.engineRestUrl}user/${userId}/profile`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`Get User Profile`)),
      catchError(this.handleError('getUserProfile', []))
    );
  }

  /**
   * User Login - FormData Post
   * @param variables
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
   * get user Groups
   * @param queryParams
   */
  getIdentity(queryParams = {}) {
    const endpoint = `${this.engineRestUrl}identity/groups`;
    return this.http.get<any>(endpoint, { params: queryParams }).pipe(
      tap(processDefinitions => this.log(`Get Identity`)),
      catchError(this.handleError('getUserProfile', []))
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
