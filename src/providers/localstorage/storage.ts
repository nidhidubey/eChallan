import { Injectable, OnInit } from '@angular/core';
@Injectable()
export class StorageService {
  constructor() {}

  public storeData(field_name: any, data: any) {
    localStorage.setItem(field_name, JSON.stringify(data));
  }

  public getData(field_name: any) {
    const data = JSON.parse(localStorage.getItem(field_name));
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  clearData() {
    localStorage.clear();
  }
}
