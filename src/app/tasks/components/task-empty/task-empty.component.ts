import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * Empty Task Index Component
 */
@Component({
  selector: 'app-task-empty',
  templateUrl: './task-empty.component.html',
  styleUrls: ['./task-empty.component.scss'],

})
export class TaskEmptyComponent {
  constructor(public translate: TranslateService) {

  }
}
