import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector : 'assistInfoTable',
  providers: [ ],
  templateUrl: 'applying-assistance-table.template.html',
})

export class FALAssistInfoTableComponent{
  @Input() assistInfo: any [];
  @Input() hideAddButton: boolean;
  @Output() public assistTableActionHandler = new EventEmitter();
  @ViewChild('deleteModal') deleteModal;
  removeIndex: number;
  modalConfig = {title:'Remove Deadline', description:''};

  editAssist(index){
    this.assistTableActionHandler.emit({
      type:'edit',
      index: index
    });
  }

  removeAssist(index){
    this.deleteModal.openModal();
    this.removeIndex = index;
    this.modalConfig.description = 'Please confirm that you want to remove "' + this.assistInfo[index] + '" deadline.';
  }

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.assistTableActionHandler.emit({
      type:'remove',
      index: this.removeIndex
    });
  }
}
