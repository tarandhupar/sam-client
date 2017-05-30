import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector : 'authInfoTable',
  providers: [ ],
  templateUrl: 'authorization-table.template.html',
})

export class FALAuthInfoTableComponent{
  @Input() displayAuthInfo: any = [];
  @Input() hideAddButton: boolean;
  @Output() public authTableActionHandler = new EventEmitter();
  @ViewChild('deleteModal') deleteModal;
  removeIndex: number;
  remParentIndex: number;
  modalConfig = {title:'', description: ''};
  review: boolean = false;

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.authTableActionHandler.emit({
      type:'remove',
      index: this.removeIndex,
      parentIndex: this.remParentIndex
    });
  }

  editAuth(index: number, parentIndex:number = null){

    this.authTableActionHandler.emit({
      type:'edit',
      index: index,
      parentIndex: parentIndex
    });
  }

  removeAuth(index, parentIndex:number = null){
    this.deleteModal.openModal();
    let desc = '';
    let title = '';

    if(parentIndex  == null) {
      if(this.displayAuthInfo[index].label !== '') {
        desc = 'Please confirm that you want to delete "' + this.displayAuthInfo[index].label + '" authorization. Any amendments associated to this authorization will also be deleted.';
      } else {
        desc = 'Please confirm that you want to delete authorization. Any amendments associated to this authorization will also be deleted.';
      }
      title = 'Delete Authorization';
    }
    else if(parentIndex !== null){
      if(this.displayAuthInfo[parentIndex].children[index].label !== '') {
        desc = 'Please confirm that you want to delete "' + this.displayAuthInfo[parentIndex].children[index].label + '" authorization.';
      } else {
        desc = 'Please confirm that you want to delete authorization.';
      }
      title = 'Delete Amendments';
    }

    this.modalConfig.description = desc;
    this.modalConfig.title = title;
    this.removeIndex = index;
    this.remParentIndex = parentIndex;
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
