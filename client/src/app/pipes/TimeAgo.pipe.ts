import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTimeAgo',
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) return 'Posted just now';
    if (diff < 3600) return `Posted ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `Posted ${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Posted yesterday';

    return `Posted ${Math.floor(diff / 86400)} days ago`;
  }

}
