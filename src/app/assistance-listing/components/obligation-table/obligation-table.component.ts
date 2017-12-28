import {Component, Input, Output, EventEmitter, ViewChild, OnChanges} from '@angular/core';
import moment = require("moment");

@Component({
  selector: 'falObligationFYTable',
  providers: [],
  templateUrl: 'obligation-table.template.html',
})
export class FALObligationFYTableComponent implements OnChanges {

  @Input() tableView: any;
  @Input() hideAddButton: boolean;
  @Output() public obligationTableActionHandler = new EventEmitter();
  @ViewChild('deleteModal') deleteModal;
  removeIndex: number;
  description: string;
  currentFY: string;
  prevFY: string;
  nextFY: string;

  ngOnInit() {
    this.currentFY = this.tableView.fyYearOptions.currentFY.substring(2);
    this.prevFY = this.tableView.fyYearOptions.prevFY.substring(2);
    this.nextFY = this.tableView.fyYearOptions.nextFY.substring(2);
  }
  
  ngOnChanges(changes: any) {
    if(changes && changes.tableView) {
      this.currentFY = this.tableView.fyYearOptions.currentFY.substring(2);
      this.prevFY = this.tableView.fyYearOptions.prevFY.substring(2);
      this.nextFY = this.tableView.fyYearOptions.nextFY.substring(2);
    }
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
    let deleteModelMsg = '';
    let assistanceType = {};
    let description = '';
    let msg = 'Please confirm that you want to delete "';
    description = this.tableView.obligationsInfo[index].description;
    assistanceType = this.tableView && this.tableView.obligationsInfo[index] && this.tableView.obligationsInfo[index].assistanceType ? this.tableView.obligationsInfo[index].assistanceType : null;
    if((description !== null && description !== '') && (assistanceType !== null)) {
      deleteModelMsg = msg + assistanceType['name'] + '. ' + description + '" obligation.';
    } else if((description !== null && description !== '') && (assistanceType === null)) {
      deleteModelMsg = msg + description + '" obligation.';
    } else if((assistanceType !== null) && (description === null || description === '')) {
      deleteModelMsg = msg + assistanceType['name'] + '" obligation.';
    } else if((description === null || description === '') && (assistanceType === null)) {
      deleteModelMsg = 'Please confirm that you want to delete obligation.';
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
