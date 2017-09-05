import * as _ from 'lodash';

export interface SectionInfo { // todo: switch to string enum
  id: string, // one of FALSectionNames
  status: string // 'pristine' or 'updated', maybe 'invalid' as well ?
}

//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class OpportunityFormViewModel {
  private _opportunityId: string;
  private _opportunity: any;
  private _data: any;
  private _additionalInfo: any;
  public existing: any;

  constructor(opportunity) {
    this._opportunity = opportunity ? opportunity : {};
    this._data = (opportunity && opportunity.data) ? opportunity.data : {};
    this._opportunityId = (opportunity && opportunity.id) ? opportunity.id : null;
    this._additionalInfo = (opportunity && opportunity.additionalInfo) ? opportunity.additionalInfo : {sections: []};
  }

  get data() {
    return this._data;
  }

  get dataAndAdditionalInfo() {
    return {
      data: this._data,
      additionalInfo: this._additionalInfo
    };
  }

  set opportunityId(opportunityId: string) {
    this._opportunityId = opportunityId;
  }

  get opportunityId() {
    return this._opportunityId;
  }

  get isNew() {
    return this._opportunityId == null || typeof this._opportunityId === 'undefined';
  }

  get title() {
    return this._data.title || '';
  }

  set title(title) {
    this._data.title = title;
  }
}
