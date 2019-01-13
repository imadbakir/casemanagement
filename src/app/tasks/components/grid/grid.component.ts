import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * Tasks Dashlet Grid
 */
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  constructor(
    public translate: TranslateService,
  ) {

  }
}
