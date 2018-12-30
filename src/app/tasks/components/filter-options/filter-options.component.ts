import { Component } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

/**
 * Filter Options Menu
 */

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent {
  id = '';
  constructor(public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public camundaService: CamundaRestService,
    public modalController: ModalController,
    public event: EventsService) {
    this.id = this.navParams.data.id;

  }
  /**
   * Close Popover
   */
  close() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Delete Filter
   */
  delete() {
  // TODO: Confirm Before Deletion
    this.camundaService.deleteFilter(this.id).subscribe(() => {
      this.event.announceFiltersRefresh('refresh');
    });
    this.close();
  }
  /**
   * Open Filter Modal
   */
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

}
