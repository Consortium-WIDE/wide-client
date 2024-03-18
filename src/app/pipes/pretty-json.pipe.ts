import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson',
  standalone: true
})
export class PrettyJsonPipe implements PipeTransform {
  transform(value: any, removeCurlyBraces: boolean = true, separator: string = '\n\n'): string {
    // Function to remove curly braces and trailing spaces after new lines from JSON string
    const formatJsonString = (jsonString: string, removeBraces: boolean): string => {
      let formattedString = jsonString;
      if (removeBraces && jsonString.startsWith('{') && jsonString.endsWith('}')) {
        formattedString = jsonString.substring(1, jsonString.length - 1);
      }
      // Remove spaces after new lines
      formattedString = formattedString.replace(/(\n)\s+/g, '$1');
      return formattedString.trim();
    };

    if (Array.isArray(value)) {
      // Process each object in the array, then join with separator
      return value
        .map(obj => JSON.stringify(obj, null, 2))
        .map(jsonString => formatJsonString(jsonString, removeCurlyBraces))
        .join(separator);
    } else if (value && typeof value === 'object') {
      // Process a single object
      let jsonString = JSON.stringify(value, null, 2);
      return formatJsonString(jsonString, removeCurlyBraces);
    }
    // Return the value as is if it's neither an object nor an array
    return value;
  }
}