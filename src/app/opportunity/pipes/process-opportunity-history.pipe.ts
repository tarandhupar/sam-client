import { Pipe, PipeTransform } from '@angular/core';
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {OpportunityTypeLabelPipe} from "./opportunity-type-label.pipe";
import * as _ from 'lodash';


@Pipe({name: 'processOpportunityHistory'})
export class ProcessOpportunityHistoryPipe implements PipeTransform {
  transform(historyAPI: any, tempOpportunityApi: any, qParams:any): any {
    /** Setup necessary variables and functions for processing history **/
    let typeLabel = new OpportunityTypeLabelPipe();
    let dateFormat = new DateFormatPipe();

    // filter through history items to find original opportunity, and save its type label
    // assumption: the original history item is the only one without a parent notice
    let isOriginal = function(historyItem) {
      return historyItem.parent_notice == null;
    };
    let originalOpportunity = _.filter(historyAPI.content.history, isOriginal)[0];
    let originalTypeLabel;
    if(originalOpportunity == null) {
      originalTypeLabel = "No Type Label";
    } else {
      originalTypeLabel = typeLabel.transform(originalOpportunity.procurement_type);
    }

    // function that takes a history item and returns a title for it
    let makeTitle = function(historyItem) {
      let prefix = ''; // construct the correct prefix

      if(historyItem.parent_notice != null) {
        prefix = 'Updated';
      }

      // Canceled prefix takes precedence over updated
      if(historyItem.cancel_notice === '1') {
        prefix = 'Canceled';
      }

      // Original prefix takes precedence over all others
      if(historyItem.parent_notice == null) {
        prefix = 'Original';
      }

      let type = historyItem.procurement_type;
      let currentTypeLabel = typeLabel.transform(type); // label for type of current history item

      switch(type) {
        // For these types, show title as prefix and opportunity type
        case 'p': // Presolicitation
        case 'r': // Sources Sought
        case 's': // Special Notice
        case 'g': // Sale of Surplus Property
        case 'f': // Foreign Government Standard
        case 'k': // Combined Synopsis/Solicitation
          return prefix + ' ' + currentTypeLabel;

        // For these types, show the opportunity type as the title with no prefix
        case 'a': // Award Notice
        case 'j': // Justification and Approval (J&A)
        case 'i': // Intent to Bundle Requirements (DoD-Funded)
        case 'l': // Fair Opportunity / Limited Sources Justification
          return currentTypeLabel;

        // For modifications or cancellations, show the appropriate prefix plus original opportunity type
        case 'm': // Modification/Amendment/Cancel
          return prefix + ' ' + originalTypeLabel;

        // Unrecognized type, show generic message
        default:
          return prefix + ' Contract Opportunity';
      }
    };

    /** Process history into a form usable by history component **/
    let processHistoryItem = function(historyItem) {
      let processedHistoryItem = {};
      processedHistoryItem['id'] = historyItem.notice_id;
      processedHistoryItem['title'] = makeTitle(historyItem);
      processedHistoryItem['description'] = ''; // not implemented yet
      processedHistoryItem['date'] = dateFormat.transform(historyItem.posted_date, 'MMM DD, YYYY h:mm a z');
      processedHistoryItem['url'] = '/opportunities/' + historyItem.notice_id;
      processedHistoryItem['index'] = historyItem.index;
      processedHistoryItem['isTagged'] = false; // todo: decide on logic for which opportunities are tagged
      processedHistoryItem['authoritative'] = historyItem.authoritative;
      processedHistoryItem['queryParams'] = qParams;
      processedHistoryItem['ariaLabel'] = "Current Contract Opportunity";
      return processedHistoryItem;
    };
    let processedHistory = historyAPI.content.history.map(processHistoryItem);
    //sort by index to show history by version (oldest to newest)
    processedHistory = _.sortBy(processedHistory, function(item){ return item.index; });

    /** Show alert if current version is not the authoritative version **/
    let isCurrent = function(historyItem) { return historyItem.id === (tempOpportunityApi.id!=null? tempOpportunityApi.id: tempOpportunityApi.opportunityId) };
    let isAuthoritative = function(historyItem) { return historyItem.authoritative === '1'; };

    let current = _.filter(processedHistory, isCurrent)[0];
    let authoritative = _.filter(processedHistory, isAuthoritative)[0];
    let showRevisionMessage:any = false;
    if(authoritative && current.id !== authoritative.id) {
      showRevisionMessage = true;
    }
    return {
      processedHistory: processedHistory,
      showRevisionMessage: showRevisionMessage,
    }
  }
}
