import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reslovedPipe'
})
export class ReslovedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // console.log(args);
    // if (args) {
    //   const resolvedTicketsOnly = value.filter(tik => tik['is_resolved'] === args);
    //   console.log(resolvedTicketsOnly);
    //   return resolvedTicketsOnly;
    // }
    return value.filter(tik => tik['is_resolved'] === args);
  }

}
