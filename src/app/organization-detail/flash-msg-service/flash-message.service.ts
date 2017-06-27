import {Injectable} from "@angular/core";

@Injectable()
export class FlashMsgService{
  isFlashMsgShow: boolean = false;
  _isCreateOrgSuccess: boolean = false;
  _isMoveOrgSuccess: boolean = false;

  resetFlags(){
    this.isCreateOrgSuccess = false;
    this.isMoveOrgSuccess = false;
  }

  set isCreateOrgSuccess(isSuccess:boolean){this._isCreateOrgSuccess = isSuccess;}
  get isCreateOrgSuccess(){return this._isCreateOrgSuccess;}
  set isMoveOrgSuccess(isSuccess:boolean){this._isMoveOrgSuccess = isSuccess;}
  get isMoveOrgSuccess(){return this._isMoveOrgSuccess;}
  hideFlashMsg(){this.isFlashMsgShow = false;}
  showFlashMsg(){this.isFlashMsgShow = true;}
}
