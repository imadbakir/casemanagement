import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EnvService } from '../services/env.service';

@Injectable({
    providedIn: 'root'
})
export class BasicAuthInterceptor implements HttpInterceptor {
    urls = [this.env.engineApiUrl, this.env.engineRestUrl];
    constructor(public auth: AuthService, private env: EnvService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUser = this.auth.getUser();
        if (currentUser && currentUser.token && this.urlMatches(this.urls, request)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Basic ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
    urlMatches(urls: string[], req: HttpRequest<any>): boolean {
        for (let i = 0; i !== urls.length; i++) {
            if (req.url.includes(urls[i])) {
                return true;
            }
        }
        return false;
    }
}
