import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader2',
  template: `
    <header>
      <div class="usa-grid">
        <a class="pull-left sam_hat_img">
          <img class="marginCenter" src="assets/img/sam_hat_logo.jpg">
        </a>
        <samSearchbar class="pull-left m_L-4x m_T-2x" [size]="'small'" (onSearch)="onSearchEvent($event)"></samSearchbar>      
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
