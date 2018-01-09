import {Injectable} from "@angular/core";
import {
  OppNoticeTypeDbMap, OppNoticeTypeFieldsMap, OpportunityFieldNames,
  OpportunitySectionFieldsBiMap
} from "../../data-model/opportunity-form-constants";


@Injectable()
export class OppRelatedNoticeAutoFillService {
  viewModel: any;

  getNoticeTypeId(noticeType) {
    return OppNoticeTypeDbMap[noticeType];
  }

  checkFieldAutoFill(noticeId, sectionField) {
    if (OppNoticeTypeFieldsMap[noticeId] && OppNoticeTypeFieldsMap[noticeId][sectionField])
      return OppNoticeTypeFieldsMap[noticeId][sectionField].display && OppNoticeTypeFieldsMap[noticeId][sectionField].autoFill;
    return false;
  }

  autoFillFormFields(relatedNoticeData: any, noticeType: any, viewModel: any) {
    this.viewModel = viewModel;
    let noticeId = this.getNoticeTypeId(noticeType);
    this.autoFillHeaderViewModel(relatedNoticeData, noticeId);
  }

  autoFillHeaderViewModel(relatedNoticeData: any, noticeId: any) {
    let sectionFields;
    sectionFields = OpportunitySectionFieldsBiMap.sectionFields.header;
    for (let sectionField of sectionFields) {
      if (this.checkFieldAutoFill(noticeId, sectionField) && sectionField === OpportunityFieldNames.TITLE) {
        this.viewModel.title = relatedNoticeData.data.title;
      }
    }
  }
}
