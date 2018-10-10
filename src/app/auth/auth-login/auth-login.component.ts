import { Component, OnInit } from '@angular/core';
import { FormioResourceConfig, FormioResourceService, FormioResourceIndexComponent } from 'angular-formio/resource';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteServiceProvider } from '../../remote.service';
import { TaskOptionsComponent } from '../../task-options/task-options.component';
import { PopoverController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormioAuthLoginComponent, FormioAuthService } from 'angular-formio/auth';
import { CamundaRestService } from '../../camunda-rest.service';
import { AuthService } from '../../auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent extends FormioAuthLoginComponent {
    user = { username: '', password: '' };
    loginError = false;
    constructor(public service: FormioAuthService, public camundaService: CamundaRestService,
        public authSerivce: AuthService, public translate: TranslateService) {
        super(service);
    }
    beforeSubmit(event) {
        const user = { username: event.data.username, password: event.data.password };
        this.camundaService.postUserLogin(user).subscribe((authObj) => {
            if (authObj.status !== 401) {
                this.camundaService.getIdentity(user.username).subscribe((identity) => {
                    user['groups'] = identity.groups;
                    this.camundaService.getUserProfile(user.username).subscribe((profileData) => {
                        user['profile'] = profileData;
                        this.authSerivce.setUser(user);

                    });
                });
            }
        });
        // this.service.onLoginSubmit(event);
    }
    submit() {
        this.camundaService.postUserLogin(this.user).subscribe((authObj) => {
            if (authObj.status !== 401) {
                this.loginError = false;
                this.camundaService.getIdentity(this.user.username).subscribe((identity) => {
                    this.user['groups'] = identity.groups;
                    this.camundaService.getUserProfile(this.user.username).subscribe((profileData) => {
                        this.user['profile'] = profileData;
                        this.authSerivce.setUser(this.user);

                    });
                });
            } else {
                this.loginError = true;
            }
        });
    }
}
