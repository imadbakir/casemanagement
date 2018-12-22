import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent {
    user = { username: '', password: '' };
    loginError = false;
    constructor(
        public camundaService: CamundaRestService,
        public authSerivce: AuthService,
        public translate: TranslateService) {
    }

    submit() {
        this.camundaService.postUserLogin(this.user).subscribe((authObj) => {
            if (authObj.status !== 401) {
                this.loginError = false;
                this.camundaService.getIdentity({ userId: this.user.username }).subscribe((identity) => {
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
