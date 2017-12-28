export class FHRoleModel{

  private _raw: any;
  private typeLevelMap:any = {'department':1,'agency':2,'office':3};

  constructor(){}

  get permissions(){
    let roleMethods = [];
    if(this._raw._embedded[1]){
      this._raw._embedded[1]['_links'].forEach( e => {
        if ( e.link.rel !== "LOGO") roleMethods.push(e.link);
      });
    }
    return roleMethods;
  }

  get logo(){
    let logo = "";
    this._raw._embedded[1]['_links'].forEach( e => {
      if ( e.link.rel == "LOGO") logo = e.link.href;
    });
    return logo;
  }

  hasPermissionType(method,orgType){
    let hasPermission = false;
    this.permissions.forEach( e => {
      if(e.method === method && this.compareOrgLevel(e.rel.toLowerCase(), orgType.toLowerCase())) hasPermission = true;
    });
    return hasPermission;
  }

  canMoveOffice(){
    let hasPermission = false;
    this.permissions.forEach( e => {
      if(e.method === "PUT_TRANSFER" && e.rel.toLowerCase() === "office_move") hasPermission = true;
    });
    return hasPermission;
  }

  static FromResponse(res: any): FHRoleModel {
    let ret = new FHRoleModel();
    ret._raw = res;
    return ret;
  }

  /**
   * Returns true if type1 is higher or equal to type2
   * @param type1
   * @param type2
     */
  compareOrgLevel(type1, type2){
    return this.typeLevelMap[type1] <= this.typeLevelMap[type2];
  }

}
