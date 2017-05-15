import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import moment = require("moment");

@Component({
  selector: 'falObligationFYTable',
  providers: [],
  templateUrl: 'obligation-table.template.html',
})
export class FALObligationFYTableComponent {

  @Input() obligationsInfo = [];
  @Input() fyYearOptions: any;
  @Input() total: any;
  @Input() hideAddButton: boolean;
  @Output() public obligationTableActionHandler = new EventEmitter();
  @ViewChild('deleteModal') deleteModal;
  removeIndex: number;
  description: string;
  currentFY: string;
  prevFY: string;
  nextFY: string;


  ngOnInit() {
    this.currentFY = this.fyYearOptions.currentFY.substring(2);
    this.prevFY = this.fyYearOptions.prevFY.substring(2);
    this.nextFY = this.fyYearOptions.nextFY.substring(2);
  }


  editObligation(index) {
    this.obligationTableActionHandler.emit({
      type: 'edit',
      index: index
    });
  }

  removeObligation(index) {
    this.deleteModal.openModal();
    this.removeIndex = index;
    let deleteModelMsg;
    let assistanceType;
    let description;
    if (this.obligationsInfo[index].assistanceType.name == null || this.obligationsInfo[index].assistanceType.name == undefined) {
      assistanceType = '';
    } else {
      assistanceType = this.obligationsInfo[index].assistanceType.name;
    }
    if (this.obligationsInfo[index].description == null || this.obligationsInfo[index].description == undefined) {
      description = '';
    } else {
      description = this.obligationsInfo[index].description;
    }

    if ((assistanceType || description)) {
      deleteModelMsg = 'Please confirm that you want to remove "' + assistanceType + ' ' + description + '" obligation.';
    } else {
      deleteModelMsg = 'Please confirm that you want to remove obligation.'
    }
    this.description = deleteModelMsg;
  }
  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.obligationTableActionHandler.emit({
      type: 'remove',
      index: this.removeIndex
    });
  }
}
