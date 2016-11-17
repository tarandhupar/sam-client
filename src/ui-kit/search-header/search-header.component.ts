import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samSearchHeader',
  template: `
    <header>
      <div class="usa-grid align-top">
        <div class="header-container">
          <a class="hat-img" [routerLink]="['/']">
            <img class="marginCenter" src="assets/img/sam_hat_logo.jpg">
          </a>
          <samSearchbar [size]="'small'" (onSearch)="onSearchEvent($event)" 
           [keyword]="keyword" [placeholder]="'#keyword'" [filterValue]="filterValue"></samSearchbar>          
        </div>   
      </div>
      <div class="m_R-2x align-top pull-right">
        <img title="An official website of the United States Government" class="image-wrap"
           src="../../assets/img/us_flag_small.png" alt="US Flag Logo"/>
      </div>
      <SamHeaderLinks (onDropdownToggle)="dropdownEventControl($event)"></SamHeaderLinks>
      
    </header>
`,
  styleUrls: [ 'search-header.css' ],
})
export class SamSearchHeaderComponent {

  @Input() keyword: string;

  @Input() filterValue: string;

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchHeaderDropdownControl: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(){

  }

  onSearchEvent($event) {
    this.searchEvent.emit($event);
  }

  dropdownEventControl(value){
    this.searchHeaderDropdownControl.emit(value);
  }
}
