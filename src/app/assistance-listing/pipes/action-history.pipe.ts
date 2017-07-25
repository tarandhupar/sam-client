import {Pipe, PipeTransform} from '@angular/core';
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {ActionHistoryLabelPipe} from "./action-history-label.pipe";
import {RequestHistoryLabelPipe} from "./request-history-label.pipe";
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {FHService} from "../../../api-kit/fh/fh.service";


@Pipe({name: 'actionHistory'})
export class ActionHistoryPipe implements PipeTransform {
  constructor(private fhService: FHService){}
  orgNames: any;
  observable: Observable<any>;
  subject: ReplaySubject<any>;


  transform(actionHistoryArray:any) : any {
    this.subject = new ReplaySubject(1);

    /** Setup necessary variables and functions for processing history **/

    /** Process history into a form usable by history component **/


    let processOrganizationNames = function(historyItem){
      if (historyItem.action_type == 'agency' && historyItem.requested_organizationId != null && historyItem.requested_organizationId.length > 0){
        return historyItem.requested_organizationId;
      }
    };

    let organizationIds = actionHistoryArray._embedded.jSONObjectList.map(processOrganizationNames).filter(function(e){return e}).join();
    let organizationNamesAPI = this.loadOrganizationNames(organizationIds);
    this.observable = new Observable();
    this.processHistoryItems(organizationNamesAPI, actionHistoryArray);
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
        let value = item['org']['name'] || item['org']['agencyName'];
        let orgName = {
          key: key,
          value: value
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

  private processHistoryItems(organizationNamesAPI: Observable<any>, actionHistoryArray: any){
    let processHistoryItem = (historyItem) => {
      let dateFormat = new DateFormatPipe();
      let actionHistoryLabelPipe = new ActionHistoryLabelPipe();
      let processedHistoryItem1 = {};
      let requestHistoryLabelPipe = new RequestHistoryLabelPipe();
      processedHistoryItem1['date'] = dateFormat.transform(historyItem.action_date, 'MMMM DD, YYYY h:mm a');
      processedHistoryItem1['title'] = actionHistoryLabelPipe.transform(historyItem.action_type);
      processedHistoryItem1['comment'] = historyItem.action_reason;
      processedHistoryItem1['submitter'] = historyItem.action_submitter;
      processedHistoryItem1['url'] = '/programs/' + historyItem.program_id + "/view";
      if (historyItem.action_type == 'agency' && historyItem.requested_organizationId != null && historyItem.requested_organizationId.length > 0){
        processedHistoryItem1['titleNumberAgency'] = _.find(this.orgNames, function(o) { return o.key == historyItem.requested_organizationId; }).value;
        if (processedHistoryItem1['titleNumberAgency'] == null) {
          processedHistoryItem1['titleNumberAgency'] = "New Agency: Not Available";
        } else {
          processedHistoryItem1['titleNumberAgency'] = "New Agency: " + processedHistoryItem1['titleNumberAgency'];
        }
      } else if (historyItem.action_type == 'title') {
        processedHistoryItem1['titleNumberAgency'] = historyItem.requested_title;
        if (processedHistoryItem1['titleNumberAgency'] == null) {
          processedHistoryItem1['titleNumberAgency'] = "New Title: Not Available";
        } else {
          processedHistoryItem1['titleNumberAgency'] = "New Title: " + processedHistoryItem1['titleNumberAgency'];
        }
      } else if (historyItem.action_type == 'program_number'){
        processedHistoryItem1['titleNumberAgency'] = historyItem.requested_programNumber;
        if (processedHistoryItem1['titleNumberAgency'] == null) {
          processedHistoryItem1['titleNumberAgency'] = "New Number: Not Available";
        } else {
          processedHistoryItem1['titleNumberAgency'] = "New Number: " + processedHistoryItem1['titleNumberAgency'];
        }
      }
      let processedHistoryItem2 = {};
      processedHistoryItem2['date'] = dateFormat.transform(historyItem.request_date, 'MMMM DD, YYYY h:mm a');
      processedHistoryItem2['title'] = requestHistoryLabelPipe.transform(historyItem.request_type);
      processedHistoryItem2['comment'] = historyItem.request_reason;
      processedHistoryItem2['submitter'] = historyItem.request_submitter;
      processedHistoryItem2['url'] = '/programs/' + historyItem.program_id + "/view";
      let processedHistoryArray = [processedHistoryItem1, processedHistoryItem2];
      return processedHistoryArray;
    };

    organizationNamesAPI.subscribe(api => {
      let toReturn = _.flatten(actionHistoryArray._embedded.jSONObjectList.map(processHistoryItem));
      for (let i in toReturn){
        if ((toReturn[i]['title'] == null || toReturn[i]['title'] == '') && toReturn[i]['date'] == null && toReturn[i]['description'] == null && toReturn[i]['submitter'] == null){
          toReturn.splice(i,1);
        }
      }
      this.subject.next(toReturn);
    });


  }
}
