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
  latestProgramId: string = null;


  transform(actionHistoryArray:any) : any {
    this.subject = new ReplaySubject(1);

    if(actionHistoryArray._embedded != null) {
      /** Setup necessary variables and functions for processing history **/

      /** Process history into a form usable by history component **/

      //remove send_omb whole item including it's request from the list before processing it
      actionHistoryArray._embedded.jSONObjectList = _.filter(actionHistoryArray._embedded.jSONObjectList, item => { return (item.action_type != "send_omb") });

      let processOrganizationNames = function(historyItem){
        if (historyItem.action_type == 'agency' && historyItem.requested_organizationId != null && historyItem.requested_organizationId.length > 0){
          return historyItem.requested_organizationId + "," + historyItem.current_organization_id;
        }
      };

      let organizationIds = actionHistoryArray._embedded.jSONObjectList.map(processOrganizationNames).filter(function(e){return e}).join();
      let organizationNamesAPI = this.loadOrganizationNames(organizationIds);
      this.observable = new Observable();
      this.processHistoryItems(organizationNamesAPI, actionHistoryArray);
    }

    return this.subject;
  }

  private loadOrganizationNames(orgIds): ReplaySubject<any> {
    let apiSubject = new ReplaySubject(1);

    if (orgIds == "" ){
      this.orgNames = {};
      Observable.of({}).subscribe(apiSubject);
      return apiSubject;
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
      if (historyItem.action_type == 'agency' && historyItem.requested_organizationId != null && historyItem.requested_organizationId.length > 0){
        let newAgency = _.find(this.orgNames, function(o) { return o.key == historyItem.requested_organizationId; }).value;
        let currentAgency = _.find(this.orgNames, function(o) { return o.key == historyItem.current_organization_id; }).value;
        let newProgramNumber = historyItem.requested_programNumber;
        let currentProgramNumber = historyItem.current_program_number;
        if (newAgency == null) {
          newAgency = "To".bold() + ": Not Available";
        } else {
          newAgency = "To".bold() + ": " + newAgency;
        }
        if (newProgramNumber == null) {
          newProgramNumber = "To".bold() + ": Not Available";
        } else {
          newProgramNumber = "To".bold() + ": " + newProgramNumber;
        }
        processedHistoryItem1['titleNumberAgency'] = newAgency + "<br />" + "From".bold() + ": " + currentAgency + "<br />" + newProgramNumber + "<br />" + "From".bold() + ": " + currentProgramNumber;
      } else if (historyItem.action_type == 'title') {
        let newTitle = historyItem.requested_title;
        let currentTitle = historyItem.current_title;
        if (newTitle == null) {
          newTitle = "To".bold() + ": Not Available";
        } else {
          newTitle = "To".bold() + ": " + newTitle;
        }
        processedHistoryItem1['titleNumberAgency'] = newTitle + "<br />" + "From".bold() + ": " + currentTitle
      } else if (historyItem.action_type == 'program_number'){
        let newProgramNumber = historyItem.requested_programNumber;
        let currentProgramNumber = historyItem.current_program_number;
        if (newProgramNumber == null) {
          newProgramNumber = "To".bold() + ": Not Available";
        } else {
          newProgramNumber = "To".bold() + ": " + newProgramNumber;
        }
        processedHistoryItem1['titleNumberAgency'] = newProgramNumber + "<br />" + "From".bold() + ": " + currentProgramNumber;
      } else if (historyItem.action_type == 'publish'){
        processedHistoryItem1['url'] = '/programs/' + historyItem.program_id + "/review";
      }
      let desc1 = [];
      if(processedHistoryItem1['titleNumberAgency']){
        desc1.push("<span class='history-titleNumberAgency'>"+processedHistoryItem1['titleNumberAgency']+"</span>")
      }
      if(processedHistoryItem1['submitter']){
        desc1.push("<span class='history-submitter'>"+processedHistoryItem1['submitter']+"</span>")
      }
      if(processedHistoryItem1['comment']){
        desc1.push("<q>"+processedHistoryItem1['comment']+"</q>")
      }
      processedHistoryItem1['description'] = desc1.join("<br/>");
      let processedHistoryItem2 = {};
      processedHistoryItem2['date'] = dateFormat.transform(historyItem.request_date, 'MMMM DD, YYYY h:mm a');
      processedHistoryItem2['title'] = requestHistoryLabelPipe.transform(historyItem.request_type);
      processedHistoryItem2['comment'] = historyItem.request_reason;
      processedHistoryItem2['submitter'] = historyItem.request_submitter;
      let desc2 = [];
      if(processedHistoryItem2['submitter']){
        desc2.push("<span class='history-submitter'>"+processedHistoryItem2['submitter']+"</span>")
      }
      if(processedHistoryItem2['comment']){
        desc2.push("<em class='history-comment'><q>"+processedHistoryItem2['comment']+"</q></em>")
      }
      processedHistoryItem2['description'] = desc2.join("<br/>");
        
      let processedHistoryArray = [processedHistoryItem1, processedHistoryItem2];
      return processedHistoryArray;
    };

    organizationNamesAPI.subscribe(api => {
      let objectToReturn;
      let arrayToReturn = _.flatten(actionHistoryArray._embedded.jSONObjectList.map(processHistoryItem));
      for (let i in arrayToReturn){
        if (
            (
              (arrayToReturn[i]['title'] == null || arrayToReturn[i]['title'] == '') && 
              arrayToReturn[i]['date'] == null && 
              (arrayToReturn[i]['description'] == null || arrayToReturn[i]['description'] == '') &&
              arrayToReturn[i]['submitter'] == null
            ) || 
            arrayToReturn[i]['title'] == 'send_omb'){
          arrayToReturn.splice(i,1);
        }
      }
      objectToReturn = {
        array: arrayToReturn,
        latestProgramId: this.latestProgramId
      };
      this.subject.next(objectToReturn);
    });


  }
}
