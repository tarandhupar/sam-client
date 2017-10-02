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

  // Header Information
  // -------------------------------------------------------
  get office(): string {
    return _.get(this._data, 'organizationId', null);
  }

  set office(office: string) {
    _.set(this._data, 'organizationId', office);
  }

  get opportunityType(): string {
    return _.get(this._data, 'type', null);
  }

  set opportunityType(type: string) {
    _.set(this._data, 'type', type);
  }

  get procurementId(): string {
    return _.get(this._data, 'solicitationNumber', null);
  }

  set procurementId(id: string) {
    _.set(this._data, 'solicitationNumber', id);
  }

  // Description
  // -------------------------------------------------------
  get description() {
    let desc = '';
    if (this._data.description && this._data.description.body) {
      desc = this._data.description.body;
    }
    return desc;
  }
  set description(description) {
    _.set(this._data, 'description.body', description);
  }
}
