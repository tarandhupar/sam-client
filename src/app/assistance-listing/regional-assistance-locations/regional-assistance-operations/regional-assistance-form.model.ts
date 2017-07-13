import * as _ from 'lodash';

//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class RAOFormViewModel {


  private _officeId: string;
  private _rao: any;
  private _data: any;


  constructor(rao) {
    this._rao = rao ? rao : {};
    this._data = (rao && rao.data) ? rao.data : {};
    this._officeId = (rao && rao.id) ? rao.id : null;
  }

  get officeId(): string {
    return this._officeId;
  }

  set officeId(value: string) {
    this._officeId = value;
  }

  get organizationId(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.organizationId || '';
  }

  set organizationId(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.organizationId = value;
  }

  get rao(): any {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao;
  }

  set rao(value: any) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao = value;
  }

  get region(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.region || '';
  }

  set region(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.region = value;
  }

  get pointOfContact(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.pointOfContact || '';
  }

  set pointOfContact(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.pointOfContact = value;
  }

  get streetAddress(): string {
    if(!this._rao.address){
      this._rao.address = {};
    }
    return this._rao.address.streetAddress || '';
  }

  set streetAddress(value: string) {
    if(!this._rao.address) {
      this._rao.address = {};
    }
    this._rao.address.streetAddress = value;

  }

  get city(): string {
    if(!this._rao.address){
      this._rao.address = {};
    }
    return this._rao.address.city || '';
  }

  set city(value: string) {
    if(!this._rao.address){
      this._rao.address = {};
    }
    this._rao.address.city = value;
  }

  get state(): string {
    if(!this._rao.address){
      this._rao.address = {};
    }
    return this._rao.address.state || '';
  }

  set state(value: string) {
    if(!this._rao.address){
      this._rao.address = {};
    }
    this._rao.address.state = value;
  }

  get zip(): string {
    if(!this._rao.address){
      this._rao.address = {};
    }
    return this._rao.address.zip || '';
  }

  set zip(value: string) {
    if(!this._rao.address){
      this._rao.address = {};
    }
    this._rao.address.zip = value;
  }

  get country(): string {
    if(!this._rao.address){
      this._rao.address = {};
    }
    return this._rao.address.country || '';
  }

  set country(value: string) {
    if(!this._rao.address){
      this._rao.address = {};
    }
    this._rao.address.country = value;
  }

  get phone(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.phone || '';
  }

  set phone(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.phone = value;
  }

  get subBranch(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.subBranch || '';
  }

  set subBranch(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.subBranch = value;
  }

  get division(): string {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.division || '';
  }

  set division(value: string) {
    if(!this._rao){
      this._rao = {};
    }
    this._rao.division = value;
  }

  get createdBy(): any {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.createdBy || '';
  }

  get modifiedBy(): any {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.modifiedBy || '';
  }

  get createdDate(): any {
    if(!this._rao){
      this._rao = {};
    }
    return this._rao.createdDate || '';
  }


  get modifiedDate(): any {
    if (!this._rao) {
      this._rao = {};
    }
    return this._rao.modifiedDate || '';
  }

}
