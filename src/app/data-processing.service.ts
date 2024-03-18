import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  constructor() { }

  public flattenJson(obj: any, parentKey: string = '', sep: string = '_'): any {
    let flattened: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}${sep}${key}` : key;

      if (Array.isArray(value)) {
        if (value.length === 1) {
          flattened = { ...flattened, ...this.flattenJson(value[0], newKey) };
        } else {
          value.forEach((item, index) => {
            flattened = { ...flattened, ...this.flattenJson(item, `${newKey}_${index + 1}`) };
          });
        }
      } else {
        flattened[newKey] = value;
      }
    }

    return flattened;
  }

  public separateJson(flattenedData: any): any[] {
    return Object.keys(flattenedData).map(key => ({ [key]: flattenedData[key] }));
  }

  public separateJsonByProp(flattenedData: any, includeRaw: boolean = false, parentKey: string = ''): any[] {
    let result: any[] = [];

    // Iterate through each key in the object
    Object.keys(flattenedData).forEach(key => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = flattenedData[key];

      // Include the raw value if specified
      if (includeRaw && parentKey === '') {
        result.push({ [newKey]: value });
      }

      // If the value is an object (and not an array or null), recurse
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Only add the compound object if it's not the top-level or if includeRaw is true
        if (parentKey || includeRaw) {
          result.push({ [newKey]: value });
        }
        // Recurse and combine results
        result = result.concat(this.separateJsonByProp(value, includeRaw, newKey));
      } else {
        // For non-object values, just add them to the result
        result.push({ [newKey]: value });
      }
    });

    return result;
  }


}
