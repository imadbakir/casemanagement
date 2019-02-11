import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * Empty Task Index Component
 */
@Component({
  selector: 'app-case-empty',
  templateUrl: './case-empty.component.html',
  styleUrls: ['./case-empty.component.scss'],

})
export class CaseEmptyComponent {
  constructor(public translate: TranslateService) {

  }
}
