import { CapitalizePipe } from "../app-pipes/capitalize.pipe";

export class Organization {
  private capitalizePipe: CapitalizePipe = new CapitalizePipe();

  private constructor() { }

  private _raw: any;

  private firstResult() {
    return this._raw && this._raw._embedded && this._raw._embedded[0];
  }

  private org() {
    return this.firstResult() && this._raw._embedded[0].org;
  }

  get ancestorOrganizationNames() {
    if (!this.org() || !this.org().fullParentPathName || !this.org().fullParentPathName.length) {
      return [];
    }
    let orgs = this.org().fullParentPathName.split('.');
    let underscoreToSpaces = orgs.map(org => org.split('_').join(' '));
    let caps = underscoreToSpaces.map(org => this.capitalizePipe.transform(org));
    return caps;
  }

  get ancestorOrganizationTypes() {
    if (!this.firstResult() || !this.firstResult().orgTypes) {
      return [];
    }
    return this.firstResult().orgTypes.map(org => this.capitalizePipe.transform(org));
  }

  static FromResponse(res: any): Organization {
    let ret = new Organization();
    ret._raw = res;
    return ret;
  }
}
