import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {LabelWrapper} from "sam-ui-elements/src/ui-kit/wrappers/label-wrapper";
import {TableData} from "./fal-table-interface/fal-table-type";


@Component({
  selector: 'fal-table',
  templateUrl: 'fal-table.template.html'
})
export class FalTableComponent {
  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  /**
   * Sets the name attribute
   */
  @Input() name: string;
  /**
   * Sets the fal table edit label text
   */
  @Input() editLabel: string;
  /**
   * Sets the fal table delete label text
   */
  @Input() deleteLabel: string;
  /**
   * Sets the fal table amend label text
   */
  @Input() amendLabel: string;
  /**
   * Sets the table data
   */
  @Input() tableData: TableData;

  /**
   * Sets the helpful hint text
   */
  @Input() hint: string;
  /**
   * Sets the general error message
   */
  @Input() errorMessage: string;

  @Output() public buttonClick = new EventEmitter();

  onEditClick(id) {
    this.buttonClick.emit({
      type: 'edit',
      id: id
    });
  }

  onDeleteClick(id) {
    this.buttonClick.emit({
      type: 'delete',
      id: id
    });
  }

}
