import { Injectable } from '@angular/core';
import {
  OppNoticeTypeFieldsMap, OppNoticeTypeDbMap, OpportunityFieldNames,
  OppNoticeTypeSectionMap
} from '../../data-model/opportunity-form-constants';
import { OpportunitySideNavService } from '../sidenav/opportunity-form-sidenav.service';


@Injectable()

export class OppNoticeTypeMapService {

  constructor(private sidenavService: OpportunitySideNavService) {}

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

  toggleSectionsDisabledProperty(noticeType) {
    let noticeId = this.getNoticeTypeId(noticeType);
    let sections = OppNoticeTypeSectionMap[noticeId];

    for(let section in sections) {
      if(sections[section].disabled) {
        this.sidenavService.disableSideNavItem(section);
      }
      else {
        this.sidenavService.enableSideNavItem(section);
      }
    }
  }

  checkSectionIsDisabled(noticeType, fragment) {
    let noticeId = this.getNoticeTypeId(noticeType);
    if(OppNoticeTypeSectionMap[noticeId] && OppNoticeTypeSectionMap[noticeId][fragment])
      return OppNoticeTypeSectionMap[noticeId][fragment].disabled;

    return false;
  }
}
