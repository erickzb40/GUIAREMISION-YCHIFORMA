import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], keyword: any, properties: string[]): any[] {
    if (!items) return [];
    if (keyword === null || keyword === undefined) return items;

    const keywordString = String(keyword).toLowerCase();

    return items.filter(item => {
      for (let i = 0; i < properties.length; i++) {
        const propertyValue = String(item[properties[i]]).toLowerCase();
        if (propertyValue.includes(keywordString)) {
          return true;
        }
      }
      return false;
    });
  }

}
