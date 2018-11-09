import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { ProcessDefinition } from '../schemas/ProcessDefinition';
import { Task } from '../schemas/Task';
import { EnvService } from './env.service';



@Injectable({
  providedIn: 'root'
})
export class CamundaRestService {
  private engineRestUrl = this.env.engineRestUrl;
  private engineApiUrl = this.env.engineApiUrl;
  private endpoints = {
    tasks: 'task',
    filter: 'filter',
  };
  httpOptions = {
    headers: new HttpHeaders()
  };
  constructor(private http: HttpClient, private env: EnvService) {

  }

  getTasks(): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  getFilters(params): Observable<any[]> {
    const endpoint = `${this.engineRestUrl}${this.endpoints.filter}`;
    return this.http.get<any>(endpoint, { params: params }).pipe(
      tap(form => this.log(`fetched filters`)),
      catchError(this.handleError('getFilters', []))
    );
  }
  getFilter(id): Observable<any> {
    const endpoint = `${this.engineRestUrl}${this.endpoints.filter}/${id}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched filter ${id}`)),
      catchError(this.handleError('getFilter', []))
    );
  }
  createFilter(variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/create`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`created filter`)),
      catchError(this.handleError('createFilter', []))
    );
  }
  updateFilter(filterId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${filterId}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`created filter`)),
      catchError(this.handleError('createFilter', []))
    );
  }
  deleteFilter(filterId): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${filterId}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`deleted filter`)),
      catchError(this.handleError('deleteFilter', []))
    );
  }
  listFilter(id): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}/list`;
    return this.http.post<any>(endpoint, this.httpOptions).pipe(
      tap(form => this.log(`fetched filter list ${id}`)),
      catchError(this.handleError('listFilter', []))
    );
  }
  getVariableInstanceByExecutionId(executionId) {
    const endpoint = `${this.engineRestUrl}history/variable-instance?executionIdIn=${executionId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }
  getProcessDefinitionXML(processDefinitionId) {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/xml`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }
  listHistory(userId) {
    const endpoint = `${this.engineRestUrl}history/task?finished=true&taskAssignee=${userId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }
  clearHistory() {
    const endpoint = `${this.engineRestUrl}history/task?finished=true`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched history`)),
      catchError(this.handleError('listHistory', []))
    );
  }
  getFilterCount(id): Observable<any> {
    const endpoint = `${this.engineRestUrl}filter/${id}/count`;
    return this.http.post<any>(endpoint, this.httpOptions).pipe(
      tap(form => this.log(`fetched filter ${id} count`)),
      catchError(this.handleError('getFilterCount', []))
    );
  }

  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }
  getTaskFormVariables(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched task form variables`)),
      catchError(this.handleError('getTaskFormVariables', []))
    );
  }

  getTask(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched Task`)),
      catchError(this.handleError('getTask', []))
    );
  }
  getHistoryTask(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}history/task?taskId=${taskId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched History Task`)),
      catchError(this.handleError('getHistoryTask', []))
    );
  }
  getExecutionVariables(executionId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched ExecutionVariables`)),
      catchError(this.handleError('getExecutionVariables', []))
    );
  }
  modifyExecutionVariables(executionId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }

  updateExecutionVariables(executionId: String, variableName: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }
  deleteExecutionVariables(executionId: String, variableName: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}execution/${executionId}/localVariables/${variableName}`;
    return this.http.delete<any>(endpoint).pipe(
      tap(form => this.log(`posted ExecutionVariables`)),
      catchError(this.handleError('modifyExecutionVariables', []))
    );
  }

  getVariablesForTask(taskId: String, variableNames: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables?variableNames=${variableNames}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError('getVariablesForTask', []))
    );
  }

  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted complete task`)),
      catchError(this.handleError('postCompleteTask', []))
    );
  }
  putUpdateTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/`;
    return this.http.put<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`put task`)),
      catchError(this.handleError('putUpdateTask', []))
    );
  }

  postAssignTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/assignee`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted assign task`)),
      catchError(this.handleError('postAssignTask', []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError('getProcessDeifnitionFormKey', []))
    );
  }

  getProcessDefinitions(): Observable<ProcessDefinition[]> {
    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition?latestVersion=true').pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  postProcessInstance(processDefinitionKey, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  deployProcess(fileToUpload: File): Observable<any> {
    const endpoint = `${this.engineRestUrl}deployment/create`;
    const formData = new FormData();

    formData.append('fileKey', fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData);
  }

  processInstanceStartForm(processDefinitionId): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/startForm`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }
  processDefinitionSubmitForm(processDefinitionId, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/${processDefinitionId}/submit-form`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }
  getUserProfile(userId): Observable<any> {
    const endpoint = `${this.engineRestUrl}user/${userId}/profile`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('getUserProfile', []))
    );
  }
  /*
    postUserLogin(variables): Observable<any> {
      const endpoint = `${this.engineApiUrl}admin/auth/user/default/login/welcome`;
      return this.http.post<any>(endpoint, variables).pipe(
        tap(processDefinitions => this.log(`posted process instance`)),
        catchError(this.handleError('postProcessInstance', []))
      );
    }
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
    /*.map((response: Response) => {
      alert(response.status);
      if (response.status === 401) {
        return Observable.throw('Unauthorized');
      } else {
        const runs = response.json();
        return runs;
      }
    });*/
  }
  getIdentity(userId) {
    const endpoint = `${this.engineRestUrl}identity/groups?userId=${userId}`;
    return this.http.get<any>(endpoint).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('getUserProfile', []))
    );
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
