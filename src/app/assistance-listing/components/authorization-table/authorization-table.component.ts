import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector : 'authInfoTable',
  providers: [ ],
  templateUrl: 'authorization-table.template.html',
})

export class FALAuthInfoTableComponent{
  @Input() displayAuthInfo: any [];
  @Input() hideAddButton: boolean;
  @Output() public authTableActionHandler = new EventEmitter();

  editAuth(index){
    this.authTableActionHandler.emit({
      type:'edit',
      index: index
    });
  }

  removeAuth(index){
    this.authTableActionHandler.emit({
      type:'remove',
      index: index
    });
  }
}
