import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../../core/services/events.service';
import { ProcessListComponent } from '../../components/process-list/process-list.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  constructor(public event: EventsService,
    public translate: TranslateService,
    public popoverCtrl: PopoverController
  ) {

  }
  async process(event) {
    const popover = await this.popoverCtrl.create({
      component: ProcessListComponent,
      event: event
    });
    return await popover.present();
  }
  ngOnInit() {
  }
}
