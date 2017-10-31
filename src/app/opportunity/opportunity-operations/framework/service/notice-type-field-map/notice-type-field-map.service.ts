import {Injectable} from '@angular/core';
import { OppNoticeTypeFieldsMap, OppNoticeTypeDbMap, OpportunityFieldNames } from '../../data-model/opportunity-form-constants';

@Injectable()

export class OppNoticeTypeFieldService {

  constructor() {}

  getNoticeTypeId(noticeType) {
    return OppNoticeTypeDbMap[noticeType];
  }

  getFieldId(field) {
    return OpportunityFieldNames[field];
  }

  checkFieldVisibility(noticeType, field) {
    let noticeId = this.getNoticeTypeId(noticeType);
    let fieldId = this.getFieldId(field);

    if(OppNoticeTypeFieldsMap[noticeId] && OppNoticeTypeFieldsMap[noticeId][fieldId])
      return OppNoticeTypeFieldsMap[noticeId][fieldId].display;

    return true;
  }

  checkFieldRequired(noticeType, field) {
    let noticeId = this.getNoticeTypeId(noticeType);
    let fieldId = this.getFieldId(field);

    if(OppNoticeTypeFieldsMap[noticeId] && OppNoticeTypeFieldsMap[noticeId][fieldId])
      return OppNoticeTypeFieldsMap[noticeId][fieldId].required;

    return true;
  }
}
