import { Pipe, PipeTransform } from '@angular/core';

import * as filesize from 'filesize';

// Transforms a filesize in bytes to a human readable decimal filesize using SI prefixes
@Pipe({name: 'filesize'})
export class FilesizePipe implements PipeTransform {

  transform(size: number): string {
    // Order of operations:
    // 1. check if size is under 1000 bytes
    // 2. convert to largest possible unit
    // 3. round result to the one's digit
    if(size <= 0) { console.log('invalid file size', size) }
    if(size < 1000) { return '<1 kB'; }

    else {
      return filesize(size, {round: 0, base: 10});
    }
  }
}

