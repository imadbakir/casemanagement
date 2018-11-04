import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrls: ['./task-options.component.scss']
})
export class TaskOptionsComponent implements OnInit {
  id = '';
  constructor(public popoverCtrl: PopoverController, public navParams: NavParams) {
    this.id = this.navParams.data.id;

  }
  close() {
    this.popoverCtrl.dismiss();
  }
  ngOnInit() {
  }

}
