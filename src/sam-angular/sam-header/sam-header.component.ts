import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader2',
  templateUrl: './sam-header.template.html',
  styleUrls: [ 'sam-header.css' ],
})
export class SamHeaderComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onSearchButtonClick(searchText) {
    this.searchEvent.emit(searchText);
  }
}
