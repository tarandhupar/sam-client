import {Pipe, PipeTransform} from '@angular/core';
import {FHService} from "../../../api-kit/fh/fh.service";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import * as _ from 'lodash';

@Pipe({name: 'organizationNames'})
export class OrganizationNamesPipe implements PipeTransform {
  constructor(private fhService: FHService){}
  orgNames: any;
  observable: Observable<any>;
  subject: ReplaySubject<any>;


  transform(cfdaNumbersArray:any) : any {
    this.subject = new ReplaySubject(1);

    /** Setup necessary variables and functions for processing history **/

    /** Process history into a form usable by history component **/


    let processOrganizationNames = function(cfdaNumbersItem){
        return cfdaNumbersItem.organizationId;
    };

    let organizationIds = cfdaNumbersArray.map(processOrganizationNames).filter(function(e){return e}).join();
    let organizationNamesAPI = this.loadOrganizationNames(organizationIds);
    this.observable = new Observable();
    this.processCfdaNumberItems(organizationNamesAPI, cfdaNumbersArray);
    return this.subject;
  }

  private loadOrganizationNames(orgIds) {
    let apiSubject = new ReplaySubject(1);

    if (orgIds == "" ){
      this.orgNames = {};
      return Observable.of({});
    }

    // construct a stream of federal hierarchy data
    let apiStream = this.fhService.getOrganizationsByIds(orgIds);


    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(res => {
      let listOrgNames = [];
      for (let item of res['_embedded']['orgs']){
        let key = item['org']['orgKey'];
        let name = item['org']['name'] || item['org']['agencyName'];
        let type = item['org']['categoryDesc'] || item['org']['type'];
        let orgName = {
          key: key,
          name: name,
          type: type
        };
        listOrgNames.push(orgName);
      }
      this.orgNames = listOrgNames;
    }, err => {
      console.log('Error loading organization names: ', err);
      return apiSubject;
    });

    return apiSubject;
  }

  private processCfdaNumberItems(organizationNamesAPI: Observable<any>, cfdaNumbersArray: any){
    let processedCfdaNumbersItem = (cfdaNumberItem) => {
      let dateFormat = new DateFormatPipe();
      let processedCfdaNumbersItem1 = {};
      processedCfdaNumbersItem1['modifiedDate'] = dateFormat.transform(cfdaNumberItem.modifiedDate, 'MMMM DD, YYYY');
      processedCfdaNumbersItem1['programNumberAuto'] = cfdaNumberItem.programNumberAuto;
      processedCfdaNumbersItem1['programNumberLow'] = cfdaNumberItem.programNumberLow;
      processedCfdaNumbersItem1['programNumberHigh'] = cfdaNumberItem.programNumberHigh;
      processedCfdaNumbersItem1['organizationId'] = cfdaNumberItem.organizationId;
      if (cfdaNumberItem.organizationId != null && cfdaNumberItem.organizationId.length > 0) {
        let agency = _.find(this.orgNames, function (o) {
          return o.key == cfdaNumberItem.organizationId;
        });
        agency && agency.name ? processedCfdaNumbersItem1['agencyName'] = agency.name : processedCfdaNumbersItem1['agencyName'] = "Not Available";
        agency && agency.type ? processedCfdaNumbersItem1['agencyType'] = agency.type : processedCfdaNumbersItem1['agencyType'] = "Not Available";
      }
      else {
        processedCfdaNumbersItem1['agencyName'] = "Not Available";
        processedCfdaNumbersItem1['agencyType'] = "Not Available";
      }
      return processedCfdaNumbersItem1;
    };

    organizationNamesAPI.subscribe(api => {
      let arrayToReturn = _.flatten(cfdaNumbersArray.map(processedCfdaNumbersItem));
      this.subject.next(arrayToReturn);
    });


  }
}
