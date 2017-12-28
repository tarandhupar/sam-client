import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class FlashMsgService{
  isFlashMsgShow: boolean = false;
  _isCreateOrgSuccess: boolean = false;
  _isMoveOrgSuccess: boolean = false;
  _isAACRequestSuccess:boolean = false;

  hierarchyStatusFilter:any = ['allactive'];
  hierarchyStatusUpdate:EventEmitter<any> = new EventEmitter<any>();

  resetFlags(){
    this.isCreateOrgSuccess = false;
    this.isMoveOrgSuccess = false;
    this.isAACRequestSuccess = false;
  }

  set isCreateOrgSuccess(isSuccess:boolean){this._isCreateOrgSuccess = isSuccess;}
  get isCreateOrgSuccess(){return this._isCreateOrgSuccess;}
  set isMoveOrgSuccess(isSuccess:boolean){this._isMoveOrgSuccess = isSuccess;}
  get isMoveOrgSuccess(){return this._isMoveOrgSuccess;}
  set isAACRequestSuccess(isSuccess:boolean){this._isAACRequestSuccess = isSuccess;}
  get isAACRequestSuccess(){return this._isAACRequestSuccess;}
  hideFlashMsg(){this.isFlashMsgShow = false;}
  showFlashMsg(){this.isFlashMsgShow = true;}

  setHierarchyStatus(val){
    this.hierarchyStatusFilter = val;
    this.hierarchyStatusUpdate.emit(this.hierarchyStatusFilter)
  }
}
