import * as moment from "moment";

export interface CBALocation {
  id: number;
  state: string;
  county: string;
  city: string;
  zipCode: string;
}
export class CBAFormViewModel {
  private _cba;
  _cbawdId: number;
  _cbaNumber: string;
  _revisionNumber: number;
  _contractServices: string;
  _contractorName: string;
  _contractorUnion: string;
  _localUnionNumber: string;
  _solicitationContractNo: string;
  _organizationId: string;
  _effectiveStartDate: Date;
  _effectiveEndDate: Date;
  _amendmentDate: Date;
  _cbaLocation: CBALocation[];

  constructor(cba) {
    this._cba = cba ? cba : {};
    this._cbawdId = this._cba['cbawdId'] ? this._cba['cbawdId'] : null;
    this._cbaNumber = this._cba['cbaNumber'] ? this._cba['cbaNumber'] : null;
    this._revisionNumber = this._cba['revisionNumber'] ? this._cba['revisionNumber'] : 0;
    this._contractServices = this._cba['contractServices'] ? this._cba['contractServices'] : null;
    this._contractorName = this._cba['contractorName'] ? this._cba['contractorName'] : null;
    this._contractorUnion = this._cba['contractorUnion'] ? this._cba['contractorUnion'] : null;
    this._localUnionNumber = this._cba['localUnionNumber'] ? this._cba['localUnionNumber'] : null;
    this._solicitationContractNo = this._cba['solicitationContractNo'] ? this._cba['solicitationContractNo'] : null;
    this._organizationId = this._cba['organizationId'] ? this._cba['organizationId'] : null;
    this._effectiveStartDate = this._cba['effectiveStartDate'] ? new Date(this._cba['effectiveStartDate']) : null;
    this._effectiveEndDate = this._cba['effectiveEndDate'] ? new Date(this._cba['effectiveEndDate']) : null;
    this._amendmentDate = this._cba['amendmentDate'] ? new Date(this._cba['amendmentDate']) : null;
    this._cbaLocation = this._cba['cbaLocation'] ? this._cba['cbaLocation'] : null;
  }

  get cbaId() {
    return this._cbawdId;
  }

  get isNew() {
    return this._cbawdId == null || typeof this._cbawdId === 'undefined';
  }

  get wdNumber() {
    return this._cbaNumber;
  }

  get revisionNumber() {
    return this._revisionNumber;
  }

  get contractServices() {
    return this._contractServices;
  }

  set contractServices(contractServices: string) {
    this._contractServices = contractServices;
  }

  get contractorName() {
    return this._contractorName;
  }

  set contractorName(contractorName: string) {
    this._contractorName = contractorName;
  }

  get contractorUnion() {
    return this._contractorUnion;
  }

  set contractorUnion(contractorUnion: string) {
    this._contractorUnion = contractorUnion;
  }

  get localUnionNumber() {
    return this._localUnionNumber;
  }

  set localUnionNumber(localUnionNumber: string) {
    this._localUnionNumber = localUnionNumber;
  }

  get solicitationContractNo() {
    return this._solicitationContractNo;
  }

  set solicitationContractNo(solicitationContractNo: string) {
    this._solicitationContractNo = solicitationContractNo;
  }

  get effectiveStartDate() {
    return this._effectiveStartDate;
  }

  set effectiveStartDate(effectiveStartDate: any) {
    this._effectiveStartDate = effectiveStartDate;
  }

  get effectiveEndDate() {
    return this._effectiveEndDate;
  }

  set effectiveEndDate(effectiveEndDate: any) {
    this._effectiveEndDate = effectiveEndDate;
  }

  get amendmentDate() {
    return this._amendmentDate;
  }

  set amendmentDate(amendmentDate: any) {
    this._amendmentDate = amendmentDate;
  }

  get organizationId() {
    return this._organizationId;
  }

  set organizationId(organizationId: string) {
    this._organizationId = organizationId;
  }

  get locations() {
    return this._cbaLocation;
  }

  get locationState() {
    return !this._cbaLocation || !this._cbaLocation.length ? null : this._cbaLocation[0]['state'];
  }

  set locationState(state: string) {
    let location = !this._cbaLocation || !this._cbaLocation.length ? <CBALocation>{} : this._cbaLocation[0];
    location['state'] = state;
    this._cbaLocation = [location];
  }

  get locationCounty() {
    return !this._cbaLocation || !this._cbaLocation.length ? null : this._cbaLocation[0]['county'];
  }

  set locationCounty(county: string) {
    let location = !this._cbaLocation || !this._cbaLocation.length ? <CBALocation>{} : this._cbaLocation[0];
    location['county'] = county;
    this._cbaLocation = [location];
  }

  get locationCity() {
    return !this._cbaLocation || !this._cbaLocation.length ? null : this._cbaLocation[0]['city'];
  }

  set locationCity(city: string) {
    let location = !this._cbaLocation || !this._cbaLocation.length ? <CBALocation>{} : this._cbaLocation[0];
    location['city'] = city;
    this._cbaLocation = [location];
  }

  get locationZipCode() {
    return !this._cbaLocation || !this._cbaLocation.length ? null : this._cbaLocation[0]['zipCode'];
  }

  set locationZipCode(zip: string) {
    let location = !this._cbaLocation || !this._cbaLocation.length ? <CBALocation>{} : this._cbaLocation[0];
    location['zipCode'] = zip;
    this._cbaLocation = [location];
  }

  //  TODO: Pull to global utility service
  private static getOffset(dateFilter) {
    let offset = new Date(dateFilter).getTimezoneOffset();
    let offsetHours : any = Math.floor(Math.abs(offset / 60));
    let offsetMins : any = Math.abs(offset % 60);
    let timezoneStd = 'Z';

    if (offsetHours < 10) {
      offsetHours = "0" + offsetHours;
    }

    if (offsetMins < 10) {
      offsetMins = "0" + offsetMins;
    }

    if (offset < 0) {
      timezoneStd = '+' + offsetHours + ':' + offsetMins;
    } else if (offset > 0) {
      timezoneStd = '-' + offsetHours + ':' + offsetMins;
    }

    return timezoneStd;
  }

  public toAPI(): {} {
    return {
      contractServices: this.contractServices,
      contractorName: this.contractorName,
      contractorUnion: this.contractorUnion,
      localUnionNumber: this.localUnionNumber,
      solicitationContractNo: this.solicitationContractNo,
      organizationId: this.organizationId,
      effectiveStartDate: this.effectiveStartDate ? moment(this.effectiveStartDate).format("YYYY-MM-DDThh:mm:ss").concat(CBAFormViewModel.getOffset(this.effectiveStartDate)) : null,
      effectiveEndDate: this.effectiveEndDate ? moment(this.effectiveEndDate).format("YYYY-MM-DDThh:mm:ss").concat(CBAFormViewModel.getOffset(this.effectiveEndDate)) : null,
      amendmentDate: this.amendmentDate ? moment(this.amendmentDate).format("YYYY-MM-DDThh:mm:ss").concat(CBAFormViewModel.getOffset(this.amendmentDate)) : null,
      cbaLocation: this.locations
    };
  }
}
