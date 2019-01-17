import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';

/**
 * Tasks Dashlet Main Component
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})



export class TasksComponent {

  constructor(
    public translate: TranslateService,
    public auth: AuthService
  ) {
  }

}
