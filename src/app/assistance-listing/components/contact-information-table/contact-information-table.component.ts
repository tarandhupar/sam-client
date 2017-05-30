import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

@Component({
  selector : 'contactInfoTable',
  providers: [ ],
  templateUrl: 'contact-information-table.template.html',
})

export class FALContactInfoTableComponent{
  @Input() contactsInfo: any;
  @Input() hideContactsForm:  boolean;
  @Output() public actionHandler = new EventEmitter();
  @ViewChild('deleteModal') deleteModal;
  removeIndex: number;
  description: string;
  review: boolean = false;

  editContact(index){
    this.actionHandler.emit({
      type:'edit',
      index: index
    });
  }

  removeContact(index){
    this.deleteModal.openModal();
    this.removeIndex = index;
    let deleteModelMsg;
    let fullName = '';
    let email = '';
    if (this.contactsInfo[index].fullName === null || this.contactsInfo[index].fullName === undefined || this.contactsInfo[index].fullName === '') {
      fullName = '';
    } else {
      fullName = this.contactsInfo[index].fullName;
    }
    if (this.contactsInfo[index].email === null || this.contactsInfo[index].email === undefined || this.contactsInfo[index].email === '') {
      email = '';
    } else {
      email = '(' + this.contactsInfo[index].email + ')';
    }
    if ((fullName || email)) {
      deleteModelMsg = 'Please confirm that you want to remove "' + fullName + email + '".';
    } else {

      deleteModelMsg = 'Please confirm that you want to remove contact.'
    }
    this.description = deleteModelMsg;
  }
  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.actionHandler.emit({
      type: 'remove',
      index: this.removeIndex
    });
  }
}
