import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { MatSort, MatTable, MatPaginator, MatTableDataSource } from '@angular/material';
import { RestService } from '../../../core/services/rest.service';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PermissionModalComponent } from '../permission-modal/permission-modal.component';
import { slideInRtl } from '../../../animations/slide-in.rtl';
import { slideIn } from '../../../animations/slide-in';
import { slideOut } from '../../../animations/slide-out';
import { slideOutRtl } from '../../../animations/slide-out.rtl';

/**
 * Permission Table
 */
@Component({
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  styleUrls: ['./permissions-table.component.scss']
})
export class PermissionsTableComponent implements OnInit, OnChanges {
  public positions = [];
  public validity = [{ id: 'create', name: 'Create' }, { id: 'read', name: 'Read' }];
  public permissions = [{ id: 'branch', name: 'Branch' }, { id: 'sons', name: 'Sons' }, { id: 'general', name: 'General' }];
  public requests = [];
  displayedColumns: string[] = ['positionId', 'requestId', 'permission', 'validity', 'options'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() data;

  constructor(private restService: RestService, private modalController: ModalController, public translate: TranslateService,
    private alertController: AlertController) {
    this.dataSource.data = this.data || [];
    this.dataSource.paginator = this.paginator;
  }
  addPermission(permission) {
    this.data.push(permission);
    this.dataSource.data = this.data;
    this.table.renderRows();
  }
  updatePermission(permission) {
    this.data.find((perm, index) => {
      if (perm.id === permission.id) {
        this.data[index] = permission;
        console.log(index);
        this.dataSource.data = this.data;
        this.table.renderRows();
        return true;
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getPosition(positionId) {
    return this.positions.find((position) => {
      return position.id === positionId;
    });
  }
  getPermission(permissionId) {
    return this.permissions.find((permission) => {
      return permission.id === permissionId;
    });
  }
  getValidity(validityId) {
    return this.validity.find((validity) => {
      return validity.id === validityId;
    });
  }
  getRequest(requestId) {
    return this.requests.find((request) => {
      return request.id === requestId;
    });
  }
  async openPermission(permission = null) {
    const dir = await this.translate.get('dir').toPromise().then(direction => direction);
    const permissionModal = await this.modalController.create({
      component: PermissionModalComponent,
      cssClass: 'side-modal',
      showBackdrop: true,
      enterAnimation: dir === 'rtl' ? slideInRtl : slideIn,
      leaveAnimation: dir === 'rtl' ? slideOutRtl : slideOut,
      componentProps: {
        validities: this.validity,
        permissions: this.permissions,
        requests: this.requests,
        positions: this.positions,
        requestPermission: permission || {}
      }
    });
    await permissionModal.present();
    const { data } = await permissionModal.onDidDismiss();
    if (data && permission) {
      this.updatePermission(data.permission);

    } else if (data) {
      this.addPermission(data.permission);

    }
  }
  async delete($event, item) {
    $event.stopPropagation();
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
            this.alertController.dismiss();
          }
        }, {
          text: translations['Yes'],
          handler: () => {
            this.restService.deletePermission(item.id).subscribe(() => {

            });
            this.data.find((positionPermission, index) => {
              if (positionPermission.id === item.id) {
                this.data.splice(index, 1);
                this.dataSource.data = this.data;
                this.table.renderRows();
                return true;
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      this.data = changes.data.currentValue;
      this.dataSource.data = this.data;
      this.table.renderRows();
    }
  }
  ngOnInit() {
    this.restService.getPositions().subscribe(data => {
      this.positions = data;
    });
    this.restService.getRequests().subscribe(data => {
      this.requests = data;
    });
    this.dataSource.sort = this.sort;
  }
}
