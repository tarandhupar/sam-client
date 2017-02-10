import { CapitalizePipe } from "../app-pipes/capitalize.pipe";

export class Organization {
  private capitalizePipe: CapitalizePipe = new CapitalizePipe();
  private _raw: any;

  private constructor() { }

  private firstResult() {
    return this._raw && this._raw._embedded && this._raw._embedded[0];
  }

  // Finds the organization object on the response.
  private org() {
    return this.firstResult() && this._raw._embedded[0].org;
  }

  get ancestorOrganizationNames() {
    if (!this.org() || !this.org().fullParentPathName || !this.org().fullParentPathName.length) {
      return [];
    }
    let orgs = this.org().fullParentPathName.split('.');
    let underscoreToSpaces = orgs.map(org => org.split('_').join(' '));
    return underscoreToSpaces.map(org => this.capitalizePipe.transform(org));
  }

  get ancestorOrganizationTypes() {
    if (!this.firstResult() || !this.firstResult().orgTypes) {
      return [];
    }
    return this.firstResult().orgTypes.map(org => this.capitalizePipe.transform(org));
  }

  get ancestorOrganizationIds() {
    if (!this.org() || !this.org().fullParentPath || !this.org().fullParentPath.length) {
      return [];
    }
    let path = this.org().fullParentPath;
    return path.split('.').filter(id => id);
  }

  /*
   * if this organization is a  level 5 (e.g.), return [level0org, level1org, ... level5org]
   */
  get parentOrgsAndSelf() {
    let orgLevels = [];
    let names = this.ancestorOrganizationNames;
    let types = this.ancestorOrganizationTypes;
    let ids = this.ancestorOrganizationIds;
    for (let i = 0; i < this.ancestorOrganizationNames.length; i++) {
      if (!names[i] || !types[i] || !ids[i]) {
        return [];
      }
      orgLevels.push({name: names[i], type: types[i], id: ids[i]});
    }
    return orgLevels;
  }

  get orgLevel() {
    return this.org().type;
  }

  get id() {
    return this.org().orgKey;
  }

  static FromResponse(res: any): Organization {
    let ret = new Organization();
    ret._raw = res;
    return ret;
  }
}
