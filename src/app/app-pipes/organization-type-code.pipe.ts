import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'organizationTypeCode'})
export class OrganizationTypeCodePipe implements PipeTransform {
  transform(data: any) : any {

    let response: any = {
      "label": "FPDS Code (Old):",
      "value": "-"
    };

    // check if data items exist, if they do return the label and the data value as properties of an object
    if(data.aacCode){
      response.label = "Activity Address Code (AAC):";
      response.value = data.aacCode;
    }
    else if(data.fpdsOrgId){
      response.label = "FPDS Org ID:";
      response.value = data.fpdsOrgId;
    }
    else if(data.fpdsCode){
      response.label = "FPDS Code:";
      response.value = data.fpdsCode;
    }
    else if(data.oldFPDSCode){
      // don't have to set label since it is this label by default
      response.value = data.oldFPDSCode;
    }

    return response;
  }
}

