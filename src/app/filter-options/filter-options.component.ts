import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '../../../node_modules/@ionic/angular';
import { CamundaRestService } from '../camunda-rest.service';
import { EventsService } from '../events.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnInit {
  id = '';
  constructor(public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public camundaService: CamundaRestService,
    public modalController: ModalController,
    public event: EventsService) {
    this.id = this.navParams.data.id;

  }
  close() {
    this.popoverCtrl.dismiss();
  }
  delete() {
    this.camundaService.deleteFilter(this.id).subscribe(() => {
      this.event.announceFiltersRefresh('');
    });
    this.close();
  }
  async edit() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      showBackdrop: true,
      backdropDismiss: true,
      animated: true,
      componentProps: { filterId: this.id }
    });
    this.close();
    return await modal.present();
  }
  ngOnInit() {
  }

}
