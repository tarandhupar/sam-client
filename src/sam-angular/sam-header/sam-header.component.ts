import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader2',
  template: `
    <header>
      <div class="usa-grid">
        <div class="header-container">
          <a class="sam_hat_img" [routerLink]="['/home']">
            <img class="marginCenter" src="assets/img/sam_hat_logo.jpg">
          </a>
          <samSearchbar [size]="'small'" (onSearch)="onSearchEvent($event)"></samSearchbar>          
        </div>   
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
