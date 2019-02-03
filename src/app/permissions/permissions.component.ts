import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTable, MatPaginator } from '@angular/material';
import { RestService } from '../core/services/rest.service';
import { ModalController, AlertController } from '@ionic/angular';
import { PermissionModalComponent } from './components/permission-modal/permission-modal.component';
import { TranslateService } from '@ngx-translate/core';

export interface PositionPermissions {
  id: number;
  requestId: number;
  positionId: number;
  validity: string;
  permission: string;
}


/**
 * Prmessions Dashlet Main Component
 */
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})



export class PermissionsComponent implements OnInit {
  public positions = [];
  public validity = [{ id: 'create', name: 'Create' }, { id: 'read', name: 'Read' }];
  public permissions = [{ id: 'branch', name: 'Branch' }, { id: 'sons', name: 'Sons' }, { id: 'general', name: 'General' }];
  public requests = [];
  public positionPermissions: PositionPermissions[] = [];
  displayedColumns: string[] = ['requestId', 'positionId', 'validity', 'permission', 'options'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource();
  constructor(private restService: RestService, private modalController: ModalController, public translate: TranslateService,
    private alertController: AlertController) {
    this.dataSource.paginator = this.paginator;
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
    const permissionModal = await this.modalController.create({
      component: PermissionModalComponent,
      componentProps: {
        validities: this.validity,
        permissions: this.permissions,
        requests: this.requests,
        positions: this.positions,
        requestPermission: permission || {}
      }
    });
    return await permissionModal.present();
  }
  async delete(item) {
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
            this.positionPermissions.find((positionPermission, index) => {
              if (positionPermission.id === item.id) {
                this.positionPermissions.splice(index, 1);
                this.dataSource.data = this.positionPermissions;
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
  ngOnInit() {
    this.restService.getPositions().subscribe(data => {
      this.positions = data;
    });
    this.restService.getRequests().subscribe(data => {
      this.requests = data;
    });
    this.restService.getPermissions().subscribe(permissions => {
      this.positionPermissions = permissions;
      this.dataSource.data = this.positionPermissions;
    });

    this.dataSource.sort = this.sort;
  }
}
