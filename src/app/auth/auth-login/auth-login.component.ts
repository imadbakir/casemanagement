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
@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent extends FormioAuthLoginComponent {
    tsks: any = [];
    filtered: any = [];
    properties: any = ['Name'];
    dataLoaded: Boolean = false;
    filter: any = {
        createdAt: '',
        dueAt: '',
        sortingProp: { name: 'firstName', type: 'string' },
        sortingDirection: -1,
        textSearch: '',
    };
    tasksOrigin: any = [];

    constructor(public service: FormioAuthService, public camundaService: CamundaRestService, public authSerivce: AuthService) {
        super(service);
    }
    beforeSubmit(event) {
        console.log(event);
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
}
