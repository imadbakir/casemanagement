import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../core/services/rest.service';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { slideIn, slideInRtl } from '../../../animations/slide-in';
import { slideOut, slideOutRtl } from '../../../animations/slide-out';

@Component({
    selector: 'app-case-filter',
    templateUrl: './case-filter.component.html',
    styleUrls: ['./case-filter.component.scss']
})
export class CaseFilterComponent implements OnInit {
    public branches = [];
    public departments = [];
    public caseTypes = [];
    public caseNames = [];
    public segmentTypes = [];
    public segmentNames = [];
    public beneficiaries = [];

    constructor(private restService: RestService, private modalController: ModalController, public translate: TranslateService, ) {

    }
    /**
 * Open New Filters Modal
 */
    async presentFilter() {
        const dir = await this.translate.get('dir').toPromise().then(direction => direction);
        const modal = await this.modalController.create({
            cssClass: 'left-side-modal slim',
            enterAnimation: dir === 'rtl' ? slideIn : slideInRtl,
            leaveAnimation: dir === 'rtl' ? slideOut : slideOutRtl,
            component: FilterModalComponent,
            showBackdrop: true,
            backdropDismiss: true,
            animated: true
        });
        return await modal.present();
    }
    ngOnInit() {
    }
}
