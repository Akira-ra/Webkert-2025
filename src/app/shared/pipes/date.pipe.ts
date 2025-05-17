import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const hour = String(date.getHours());
      const min = String(date.getMinutes());
      const sec = String(date.getSeconds());
      
      return `${year}-${month}-${day}, ${hour}:${min}:${sec}`;
    } catch (error) {
      return value;
    }
  }
}