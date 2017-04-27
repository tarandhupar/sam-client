import {Injectable} from "@angular/core";

@Injectable()
export class FlashMsgService{
  isFlashMsgShow: boolean = false;
  _isCreateOrgSuccess: boolean = false;

  resetFlags(){this.isCreateOrgSuccess = false;}
  set isCreateOrgSuccess(isSuccess:boolean){this._isCreateOrgSuccess = isSuccess;}
  get isCreateOrgSuccess(){return this._isCreateOrgSuccess;}
  hideFlashMsg(){this.isFlashMsgShow = false;}
  showFlashMsg(){this.isFlashMsgShow = true;}
}
