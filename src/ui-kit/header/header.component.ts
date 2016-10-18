import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader2',
  template: `
    <header>
      <div class="usa-grid">
        <div class="header-container">
          <a class="sam_hat_img" [routerLink]="['/']">
            <img class="marginCenter" src="assets/img/sam_hat_logo.jpg">
          </a>
          <samSearchbar [size]="'small'" (onSearch)="onSearchEvent($event)" 
           [keyword]="keyword" [placeholder]="'#keyword'" [filterValue]="filterValue"></samSearchbar>          
        </div>   
      </div>
    </header>
`,
  styleUrls: [ 'header.css' ],
})
export class SamHeaderComponent {

  @Input() keyword: string;

  @Input() filterValue: string;

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(){

  }

  onSearchEvent($event) {
    this.searchEvent.emit($event);
  }
}
