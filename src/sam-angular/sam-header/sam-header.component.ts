import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader2',
  template: `
    <header class="p_T-5x">
      <div class="usa-grid-full">
        <a class="image-wrap m_T-1x pull-left">
          <img class="marginCenter" src="assets/img/blank_icon.png">
        </a>
        <samSearchbar class="pull-left m_L-4x m_T-4x" [size]="'small'" (onSearch)="onSearchEvent($event)"></samSearchbar>
      </div>
    </header>
`,
  styleUrls: [ 'sam-header.css' ],
})
export class SamHeaderComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onSearchEvent($event) {
    this.searchEvent.emit($event);
  }
}
