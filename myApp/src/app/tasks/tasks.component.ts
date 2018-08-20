import { Component, OnInit, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { ItemSliding, PopoverController } from '@ionic/angular';
import { TaskOptionsComponent } from '../task-options/task-options.component';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  private _data: any = [];

  @Input() attribute = '';
  @Input() cond = ''; // contains, equals, gt, lt, bool
  @Input() value = '';
  @Input() title = '';
  outputOrigin: any = [];
  output: any = [];
  filter: any = {
    createdAt: '',
    dueAt: '',
    sortingProp: { name: 'priority', type: 'number' },
    sortingDirection: -1,
    textSearch: '',
  };

  @Input()
  set data(data) {
    console.log('prev value: ', this._data);
    console.log('got dara: ', data);
    if (this._data.length !== data.length) {
      this._data = data;
      this.filterList(this.cond, this.value, this.attribute);
    }
  }
  get data() {
    // transform value for display
    return this._data;
  }


  constructor(public popoverCtrl: PopoverController) {
    console.log('Hello TasksComponent Component');
  }

  static getRandomPic(id) {
    const dummyPic = {
      imad: { pic: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg' },
      eihab: { pic: 'https://www.picmonkey.com/blog/wp-content/uploads/2016/11/1-intro-photo-final.jpg' },
      // tslint:disable-next-line:max-line-length
      ahmad: { pic: 'https://static1.squarespace.com/static/586d6991e6f2e1b4e1983a61/t/5876e2eb197aea0e713349bb/1484186352503/ProfilePage_GuyRyan.jpg' }
    };

    return dummyPic[id].pic;
  }
  static getDescendantProp(obj, desc) {
    const arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()])) {
      return obj;
    }
  }
  presentPopover(myEvent) {
    const popover = this.popoverCtrl.create({
      component: TaskOptionsComponent
    });
  }
  search() {
    this.performSearch(this.filter.textSearch);
  }
  performSearch(value) {
    this.output = this.outputOrigin.filter(function (item) {
      return item['name'].toLowerCase().includes(value.toLowerCase()) ||
        item['assignee'].toLowerCase().includes(value.toLowerCase()) ||
        item['description'].toLowerCase().includes(value.toLowerCase()) ||
        item['due'].toLowerCase().includes(value.toLowerCase());
    });
  }
  getPriority(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'danger';
        break;
      case priority >= 50:
        value = 'warning';
        break;
      case priority >= 25:
        value = 'primary';
        break;
      case priority < 25:
        value = 'secondary';
        break;



    }
    return value;
  }
  getStatus(priority) {
    let value = '';
    switch (true) {
      case priority >= 75:
        value = 'Critical';
        break;
      case priority >= 50:
        value = 'Important';
        break;
      case priority >= 25:
        value = 'Normal';
        break;
      case priority < 25:
        value = 'Low';
        break;




    }
    return value;
  }
  showDetails(task) {
    task.showDetails ? task.showDetails = false : task.showDetails = true;
  }
  deleteItem(item) {

    for (var i = 0; i < this.output.length; i++) {

      if (this.output[i] == item) {
        this.output.splice(i, 1);
      }

    }

  }
  clickSlide(itemSlide: ItemSliding) {
    /*if (itemSlide.getSlidingPercent() == 0) {
      // Two calls intentional after examination of vendor.js function
      itemSlide.close();
      itemSlide.moveSliding(-380);
      itemSlide.moveSliding(-380);

      itemSlide.setElementClass('active-options-left', true);
      itemSlide.setElementClass('active-swipe-left', true);
    }
    else {
      itemSlide.close();
    }
    */
  }
  setPics(data) {
    data.forEach(element => {
      element.pic = TasksComponent.getRandomPic(element.assignee);
    });
  }


  filterList(cond, value, attr) {
    console.log(this.value);
    if (this.value) {
      this.setPics(this._data); // for testing
      switch (this.cond) {
        case 'contains':
          this.output = this._data.filter(function (item) {
            return TasksComponent.getDescendantProp(item, attr).includes(value.toLowerCase());
          });

          break;
        case 'equals':
          this.output = this._data.filter(function (item) {
            return TasksComponent.getDescendantProp(item, attr) === value;
          });
          break;
        case 'gt':
          this.output = this._data.filter(function (item) {
            return TasksComponent.getDescendantProp(item, attr) >= value;
          });
          break;
        case 'lt':
          this.output = this._data.filter(function (item) {
            return TasksComponent.getDescendantProp(item, attr) <= value;
          });
          break;
        case 'bool':
          this.output = this._data.filter(function (item) {
            return TasksComponent.getDescendantProp(item, attr) === value;
          });
          break;
        default:
          this.output = this._data;
      }
      this.outputOrigin = this.output;
      // return item[this.attribute.toLowerCase()].toLowerCase().includes(this.value.toLowerCase());
    }
  }

}
