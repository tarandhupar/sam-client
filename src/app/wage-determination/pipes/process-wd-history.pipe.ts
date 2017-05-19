import { Pipe, PipeTransform } from '@angular/core';
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";


@Pipe({name: 'processWageDeterminationHistory'})
export class ProcessWageDeterminationHistory implements PipeTransform {
  transform(historyAPI: any, qParams:any): any {


    /** Setup necessary variables and functions for processing history **/
    let dateFormat = new DateFormatPipe();

    /** Process history into a form usable by history component **/
    let processHistoryItem = function(historyItem) {
      let processedHistoryItem = {};
      processedHistoryItem['id'] = historyItem.fullReferenceNumber + '/' + historyItem.revisionNumber;
      processedHistoryItem['title'] = historyItem.fullReferenceNumber + ' - Revision ' + historyItem.revisionNumber;
      processedHistoryItem['date'] = dateFormat.transform(historyItem.publishDate, 'MMMM DD, YYYY');
      processedHistoryItem['url'] = '/wage-determination/' + historyItem.fullReferenceNumber + '/' + historyItem.revisionNumber;
      processedHistoryItem['index'] = historyItem.revisionNumber;
      processedHistoryItem['authoritative'] = historyItem.active;
      processedHistoryItem['qParams'] = qParams;
      processedHistoryItem['ariaLabel'] = "Current WDOL";
      return processedHistoryItem;
    };
    let longProcessedHistory = historyAPI._embedded.wageDetermination.map(processHistoryItem);
    let processedHistory;
    let shortProcessedHistory;
    if (longProcessedHistory.length > 5) {
      shortProcessedHistory = longProcessedHistory.slice(0, 5);
      processedHistory = shortProcessedHistory;
    } else {
      processedHistory = longProcessedHistory;
    }
    return {
      processedHistory: processedHistory,
      shortProcessedHistory: shortProcessedHistory,
      longProcessedHistory: longProcessedHistory
    }
  }
}
