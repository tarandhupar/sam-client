import {Pipe, PipeTransform} from '@angular/core';
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import * as _ from 'lodash';

@Pipe({name: 'organizationConfiguration'})
export class OrganizationConfigurationPipe implements PipeTransform {
  transform(organizationsPerPage:any, configurations:any) : any {
      let processedCfdaNumbersItem = (cfdaNumberItem) => {
        let dateFormat = new DateFormatPipe();
        let processedCfdaNumbersItem1 = {};
        processedCfdaNumbersItem1['agencyName'] = cfdaNumberItem.name;
        processedCfdaNumbersItem1['agencyType'] = cfdaNumberItem.type;
        processedCfdaNumbersItem1['organizationId'] = cfdaNumberItem.id.toString();
        let agency = _.find(configurations, function (o) {
          return cfdaNumberItem.id ? o.organizationId === cfdaNumberItem.id.toString() : o.organizationId === cfdaNumberItem.org.orgKey.toString();
        });
        if (agency === undefined){
          processedCfdaNumbersItem1['modifiedDate'] = 'N/A';
          processedCfdaNumbersItem1['programNumberAuto'] = true;
          processedCfdaNumbersItem1['programNumberLow'] = 0;
          processedCfdaNumbersItem1['programNumberHigh'] = 999;
        } else {
          processedCfdaNumbersItem1['modifiedDate'] = dateFormat.transform(agency.modifiedDate, 'MMMM DD, YYYY');
          processedCfdaNumbersItem1['programNumberAuto'] = agency.programNumberAuto;
          processedCfdaNumbersItem1['programNumberLow'] = agency.programNumberLow;
          processedCfdaNumbersItem1['programNumberHigh'] = agency.programNumberHigh;
        }
        return processedCfdaNumbersItem1;
      };
        return _.flatten(organizationsPerPage.map(processedCfdaNumbersItem));

  }
}
