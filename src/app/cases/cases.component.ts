import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';

/**
 * Cases Dashlet Main Component
 */
@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss'],
})



export class CasesComponent {

  constructor(
    public translate: TranslateService,
    public auth: AuthService
  ) {
  }

}
