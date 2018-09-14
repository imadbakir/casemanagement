import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

const STORAGE_KEY = 'local_filters';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  filtersList = [];
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
  public storeOnLocalStorage(gridItem): void {
    // get array of filters from local storage
    const currentFilterList = this.storage.get(STORAGE_KEY) || [];
    // push new task to array
    currentFilterList.push(gridItem);
    // insert updated array to local storage
    this.storage.set(STORAGE_KEY, currentFilterList);
  }
  public updateAllStorage(gridItems): void {
    // get array of filters from local storage
    this.storage.set(STORAGE_KEY, gridItems);
  }
  public deleteFromLocalStorage(gridItem): void {
    // get array of filters from local storage
    const currentFilterList = this.storage.get(STORAGE_KEY) || [];
    const temp = this.isFilterOpen(gridItem, true);
    if (temp) {
      console.log(temp);
      currentFilterList.splice(currentFilterList.indexOf(temp), 1);
    } this.storage.set(STORAGE_KEY, currentFilterList);
    // insert updated array to local storage
  }
  public isFilterOpen(filter, returnObj = false) {
    const currentFilterList = this.storage.get(STORAGE_KEY) || [];
    const temp = currentFilterList.filter(function (item) {
      return item.propName.id === filter.id;
    });
    if (returnObj) {
      return temp.length > 0 ? temp : false;
    } else {
      return temp.length > 0;
    }
  }
  public getFromLocalStorage() {
    return this.storage.get(STORAGE_KEY) || [];
  }
}
