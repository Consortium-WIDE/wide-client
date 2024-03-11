import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixTimestamp',
  standalone: true
})
export class UnixTimestampPipe implements PipeTransform {
  transform(unixTimestamp: number): Date {
    // Assuming unixTimestamp is in seconds, convert it to milliseconds
    return new Date(unixTimestamp * 1000);
  }
}
