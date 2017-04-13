//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class FALFormViewModel {
  private _isNew: boolean;
  private _data: any;

  constructor(data: any) {
    if (data) {
      this._isNew = false;
      this._data = data;
    } else {
      this._isNew = true;
      this._data = {};
    }
  }

  get isNew() {
    return this._isNew;
  }

  get relatedPrograms() {
    return this._data.relatedPrograms;
  }

  set relatedPrograms(relatedPrograms) {
    this._data.relatedPrograms = relatedPrograms;
  }

  get programNumber() {
    return this._data.programNumber;
  }

  set programNumber(programNumber) {
    this._data.programNumber = programNumber;
  }

  get alternativeNames() {
    return this._data.alternativeNames;
  }

  set alternativeNames(alternativeNames) {
    this._data.alternativeNames = alternativeNames;
  }

  get title() {
    return this._data.title;
  }

  set title(title) {
    this._data.title = title;
  }

  get data() {
    return this._data;
  }

  get objective() {
    return this._data.objective ? this._data.objective : '';
  }

  set objective(objective) {
    this._data.objective = objective;
  }

  get description() {
    return this._data.description ? this._data.description : '';
  }

  set description(description) {
    this._data.description = description;
  }

  get website() {
    return this._data.website;
  }

  set website(website) {
    this._data.website = website;
  }

  get additionalInfo() {
    let additionalInfo = '';

    if (this._data.contacts && this._data.contacts.local) {
      if (this._data.contacts.local.description) {
        additionalInfo = this._data.contacts.local.description;
      }
    }

    return additionalInfo;
  }

  set additionalInfo(additionalInfo) {
    if (!this._data.contacts) {
      this._data.contacts = {};
    }

    if (!this._data.contacts.local) {
      this._data.contacts.local = {};
    }

    this._data.contacts.local.description = additionalInfo;
  }

  get contacts() {
    return this._data.contacts ? this._data.contacts : {};
  }

  set contacts(contacts) {
    this._data.contacts = contacts;
  }

  get headquarters() {
    return this.contacts.headquarters ? this.contacts.headquarters : [];
  }

  get useRegionalOffice() {
    let useRegionalOffice = false;

    if (this._data.contacts && this._data.contacts.local) {
      useRegionalOffice = this._data.contacts.local.flag != 'none';
    }

    return useRegionalOffice;
  }

  set useRegionalOffice(flag) {
    if (!this._data.contacts) {
      this._data.contacts = {};
    }

    if (!this._data.contacts.local) {
      this._data.contacts.local = {};
    }

    this._data.contacts.local.flag = flag;
  }
}
