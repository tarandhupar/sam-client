import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'organizationTypeCode'})
export class OrganizationTypeCodePipe implements PipeTransform {
  transform(data: any) : any {

    let response: any = {
      "label": "Old FPDS Code:",
      "value": "-"
    };

    // check if data items exist, if they do return the label and the data value as properties of an object
    if(typeof data.aacCode != 'undefined' && data.aacCode != null && data.aacCode != ''){
      response.label = "AAC Code:";
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
