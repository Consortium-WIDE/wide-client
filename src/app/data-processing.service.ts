import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  constructor() { }

  public flattenJson(data: any, parentKey: string = '', res: any = {}) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let newKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
          this.flattenJson(data[key], newKey, res);
        } else {
          res[newKey] = data[key];
        }
      }
    }
    return res;
  }

  public separateJson(flattenedData: any): any[] {
    return Object.keys(flattenedData).map(key => ({ [key]: flattenedData[key] }));
  }

}
