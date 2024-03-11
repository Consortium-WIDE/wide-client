import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeCamelCase',
  standalone: true
})
export class CapitalizeCamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }

    // First, deal with special sequences of uppercase letters.
    // The idea is to avoid inserting spaces within sequences like "URL".
    // This regex looks for sequences of uppercase letters that are either
    // at the end of the string or followed by a lowercase letter (indicating
    // the end of an acronym and the start of a new word).
    let newValue = value.replace(/([A-Z]+)([A-Z][a-z]|$)/g, (match, p1, p2, offset) => {
        // If at the start, don't prepend a space, otherwise do.
        let prefix = offset > 0 ? ' ' : '';
        // If p2 is not the end of the string, it's a single uppercase letter followed by a lowercase one,
        // which means we should insert a space before it. Otherwise, p2 is the end of the string.
        return `${prefix}${p1.length > 1 ? p1 : p1.toLowerCase()}${p2.length > 1 ? ' ' + p2 : p2}`;
    });

    // Next, insert spaces before any remaining uppercase letters that are
    // followed by lowercase letters, ensuring the first letter remains uppercase.
    newValue = newValue.replace(/(.)([A-Z][a-z])/g, '$1 $2');

    // Capitalize the first letter of the result if it's not already uppercase.
    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    return newValue;
  }
}