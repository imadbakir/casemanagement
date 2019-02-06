import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from '../core/services/rest.service';
import { Permission } from '../core/schemas/permission';



/**
 * Prmessions Dashlet Main Component
 */
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})



export class PermissionsComponent implements OnInit {
  public positionPermissions: Permission[] = [];


  constructor(private restService: RestService, public translate: TranslateService) {
  }




  ngOnInit() {
    this.restService.getPermissions().subscribe(permissions => {
      this.positionPermissions = permissions;
      console.log(this.positionPermissions);
    });
  }
}
