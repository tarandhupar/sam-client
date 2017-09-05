import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'organizationTypeCode'})
export class OrganizationTypeCodePipe implements PipeTransform {
  transform(data: any) : any {

    let response: any = {
      "label": "FPDS Code (Old):",
      "value": "-"
    };

    // check if data items exist, if they do return the label and the data value as properties of an object
    if(data.procurementAACCode){
      response.label = "Activity Address Code (AAC):";
      response.value = data.procurementAACCode;
    }
    else if(data.cgac){
      response.label = "CGAC Code:";
      response.value = data.cgac;
    }else{
      response.label = "CGAC Code:";
      response.value = '';
    }

    return response;
  }
}

