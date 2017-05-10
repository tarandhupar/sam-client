import { Pipe, PipeTransform } from '@angular/core';
import {OpportunityPage} from "../opportunity.page";


@Pipe({name: 'getResourceTypeInfo'})
export class GetResourceTypeInfo implements PipeTransform {
  transform(type: string): string {
    let returnType;
    switch(type) {
      case 'link':
        returnType = { name: 'External link', iconClass: 'fa fa-link' };

      case '.zip':
        returnType = { name: 'Zip archive', iconClass: 'fa fa-file-archive-o' };

      case '.xls':
      case '.xlsx':
        returnType = { name: 'Excel spreadsheet', iconClass: 'fa fa-file-excel-o' };

      case '.ppt':
      case '.pptx':
        returnType = { name: 'Powerpoint presentation', iconClass: 'fa fa-file-powerpoint-o' };

      case '.doc':
      case '.docx':
        returnType = { name: 'Word document', iconClass: 'fa fa-file-word-o' };

      case '.txt':
      case '.rtf':
        returnType = { name: 'Text file', iconClass: 'fa fa-file-text-o' };

      case '.pdf':
        returnType = { name: 'PDF document', iconClass: 'fa fa-file-pdf-o' };

      case '.htm':
      case '.html':
        returnType = { name: 'Html document', iconClass: 'fa fa-html5' };

      case '.jpg':
      case '.png':
      case '.jpeg':
      case '.tif':
        returnType = { name: 'Image', iconClass: 'fa fa-file-image-o' };

      default:
        returnType = { name: 'Unknown file type', iconClass: 'fa fa-file' };
    }
    return returnType;
  }
}
