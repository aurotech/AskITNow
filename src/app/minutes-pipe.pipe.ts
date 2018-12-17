import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesPipe'
})
export class MinutesPipePipe implements PipeTransform {

  transform(value) {
    // const value = Number(val);
    if ( value <= 0) {
      return 'Please proceed to the next available technician.';
    }
    else if (value < 60) {
      return value + ' min';
    }
    else {
      let  temp = value * 60;
      const hours = Math.floor((temp / 3600));
      const minutes: number = Math.floor((temp / 60 - 60 * hours));
      if (minutes <= 15) {
        return hours + 'hr ' + '15m';
      } else if (minutes > 15 && minutes <= 30) {
        return hours + 'hr ' + '30m';
      } else if (minutes > 30 && minutes <= 45) {
        return hours + 'hr ' + '45m';
      }
      else {
        return (hours) ? hours + 1 + 'hr' : null;
      }
    }
  }

}
