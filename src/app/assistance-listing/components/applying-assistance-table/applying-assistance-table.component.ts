import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector : 'assistInfoTable',
  providers: [ ],
  templateUrl: 'applying-assistance-table.template.html',
})

export class FALAssistInfoTableComponent{
  @Input() assistInfo: any [];
  @Input() hideAddButton: boolean;
  @Output() public assistTableActionHandler = new EventEmitter();

  editAssist(index){
    this.assistTableActionHandler.emit({
      type:'edit',
      index: index
    });
  }

  removeAssist(index){
    this.assistTableActionHandler.emit({
      type:'remove',
      index: index
    });
  }
}
