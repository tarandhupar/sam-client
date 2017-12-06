import * as _ from 'lodash';
import { OppHeaderInfoViewModel } from '../sections/header-information/header-information.model';
import { OppAwardDetailsViewModel } from '../sections/award-details/award-details.model';
import { OppGeneralInfoViewModel } from '../sections/general-information/general-information.model';
import { OppClassificationViewModel } from "../sections/classification/classification.model";
import { OppContactInfoViewModel } from '../sections/contact-information/contact-information.model';

export interface SectionInfo { // todo: switch to string enum
  id: string, // one of OppSectionNames
  status: string // 'pristine' or 'updated', maybe 'invalid' as well ?
}

export interface OpportunityStatus{
  code: string,
  value: string
}

//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class OpportunityFormViewModel {
  private _opportunityId: string;
  private _opportunity: any;
  private _description: any;
  private _data: any;
  private _additionalInfo: any;
  public _status: OpportunityStatus;
  public oppHeaderInfoViewModel: OppHeaderInfoViewModel;
  public oppAwardDetailsViewModel: OppAwardDetailsViewModel;
  public oppGeneralInfoViewModel: OppGeneralInfoViewModel;
  public oppClassificationViewModel: OppClassificationViewModel;
  public oppContactInfoViewModel: OppContactInfoViewModel;
  public existing: any;

  constructor(opportunity) {
    this._opportunity = opportunity ? opportunity : {};
    this._description = opportunity ? opportunity.description : null;
    this._data = (opportunity && opportunity.data) ? opportunity.data : {};
    this._opportunityId = (opportunity && opportunity.id) ? opportunity.id : null;
    this._additionalInfo = (opportunity && opportunity.additionalInfo) ? opportunity.additionalInfo : {sections: []};
    this._status = (opportunity && opportunity.status) ? opportunity.status : null;

    //sections
    //Note: Since Description section has only one field it is not moved to its own file.
    this.oppHeaderInfoViewModel = new OppHeaderInfoViewModel(this._data);
    this.oppAwardDetailsViewModel = new OppAwardDetailsViewModel(this._data);
    this.oppGeneralInfoViewModel = new OppGeneralInfoViewModel(this._data);
    this.oppClassificationViewModel = new OppClassificationViewModel(this._data);
    this.oppContactInfoViewModel = new OppContactInfoViewModel(this._data);
  }

  get data() {
    return this._data;
  }

  get dataAndAdditionalInfo() {
    return {
      data: this._data,
      additionalInfo: this._additionalInfo,
      description: this._description
    };
  }

  // General Fields
  // -------------------------------------------------------
  get opportunityId() {
    return this._opportunityId;
  }

  set opportunityId(opportunityId: string) {
    this._opportunityId = opportunityId;
  }

  get isNew() {
    return this._opportunityId == null || typeof this._opportunityId === 'undefined';
  }

  get title(): string {
    return _.get(this._data, 'title', null);
  }

  set title(title: string) {
    _.set(this._data, 'title', title);
  }
  // Description
  // -------------------------------------------------------
  get description(): any {
    return this._description;
  }
  set description(description: any) {
    this._description =  description;
  }

  get status(): OpportunityStatus {
    return this._status;
  }

  set status(status: OpportunityStatus) {
    this.status = status;
  }
}
