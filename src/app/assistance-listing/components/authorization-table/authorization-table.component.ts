import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector : 'authInfoTable',
  providers: [ ],
  templateUrl: 'authorization-table.template.html',
})

export class FALAuthInfoTableComponent{
  @Input() displayAuthInfo: any = [];
  @Input() hideAddButton: boolean;
  @Output() public authTableActionHandler = new EventEmitter();

  editAuth(index: number, parentIndex:number = null){

    this.authTableActionHandler.emit({
      type:'edit',
      index: index,
      parentIndex: parentIndex
    });
  }

  removeAuth(index, parentIndex:number = null){
    this.authTableActionHandler.emit({
      type:'remove',
      index: index,
      parentIndex: parentIndex
    });
  }

  addAmend(index){
    this.authTableActionHandler.emit({
      type:'amend',
      index: index
    });
  }

  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}
