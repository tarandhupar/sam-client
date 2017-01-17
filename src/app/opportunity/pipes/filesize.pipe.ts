import { Pipe, PipeTransform } from '@angular/core';

import * as filesize from 'filesize';

@Pipe({name: 'filesize'})
export class FilesizePipe implements PipeTransform {

  transform(size: number): string {
    if(size < 1000) {
      return "<1 KB";
    }
    else {
      let sizeObj = filesize(size, {round: 0, base: 10, output: 'object'});
      return Math.trunc(sizeObj.value) + sizeObj.suffix;
    }
  }
}

