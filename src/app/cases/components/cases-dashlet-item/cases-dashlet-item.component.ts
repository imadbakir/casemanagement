import { Component, Input } from '@angular/core';


/**
 * Task List Item Component
 */
@Component({
  selector: 'app-cases-dashlet-item',
  templateUrl: './cases-dashlet-item.component.html',
  styleUrls: ['./cases-dashlet-item.component.scss']
})
export class CasesDashletItemComponent {

  @Input() case;

  constructor() {

  }


}
