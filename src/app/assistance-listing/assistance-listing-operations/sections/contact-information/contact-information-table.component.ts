import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector : 'contactInfoTable',
  providers: [ ],
  templateUrl: 'contact-information-table.template.html',
})

export class FALContactInfoTableComponent{
  @Input() contactsInfo: any;
  @Input() hideContactsForm:  boolean;
  @Output() public actionHandler = new EventEmitter();

  editContact(index){
    this.actionHandler.emit({
      type:'edit',
      index: index
    });
  }

  removeContact(index){
    this.actionHandler.emit({
      type:'remove',
      index: index
    });
  }
}
