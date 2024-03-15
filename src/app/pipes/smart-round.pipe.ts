import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smartRound',
  standalone: true,
})
export class SmartRoundPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) return 'Invalid number';

    // Round the number to 2 decimal places and convert to string
    const rounded = value.toFixed(2);

    // Remove trailing zeros and unnecessary decimal point if applicable
    return rounded.replace(/\.00$|0$/, '');
  }
}