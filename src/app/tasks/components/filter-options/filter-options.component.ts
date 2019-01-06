import { Component } from '@angular/core';
import { ModalController, NavParams, PopoverController, AlertController } from '@ionic/angular';
import { CamundaRestService } from '../../../core/services/camunda-rest.service';
import { EventsService } from '../../../core/services/events.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(
    public translate: TranslateService,
    public alertController: AlertController,
    public popoverCtrl: PopoverController,
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
  * Confirm Delete Filter
  */
  async delete() {
    const translations = await this.translate
      .get(['Confirm', 'Are you sure?', 'Cancel', 'Yes'])
      .toPromise().then(data => {
        return data;
      });
    const alert = await this.alertController.create({
      header: translations['Confirm'],
      message: translations['Are you sure?'],
      buttons: [
        {
          text: translations['Cancel'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.close();
          }
        }, {
          text: translations['Yes'],
          handler: () => {
            this.camundaService.deleteFilter(this.id).subscribe(() => {
              this.event.announceFiltersRefresh('refresh');
            });
            this.close();
          }
        }
      ]
    });

    await alert.present();
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
