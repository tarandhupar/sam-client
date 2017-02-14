import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samSearchHeader',
  template: `
    <header id="sam-search-header" class='search-header'>
      <div class="usa-width-one-whole">
        <div class="usa-width-two-thirds align-top m_R-0">
          <div class="header-container usa-width-one-whole">
            <a class="logo-img" [routerLink]="['/']">
              <img src="src/assets/img/transition-sam-logo.png" alt="Sam.gov Logo">
            </a>
            <div class="search-bar-container">
              <samSearchbar [size]="'small'" (onSearch)="onSearchEvent($event)"
             [keyword]="keyword" [placeholder]="'#keyword'" [filterValue]="filterValue"></samSearchbar>
            </div>
          </div>
        </div>
        <div class="usa-width-one-third m_L-2x">
          <div class="pull-right">
            <img title="An official website of the United States Government"
               src="src/assets/img/us_flag_small.png" alt="US Flag Logo"/>
          </div>
          <SamHeaderLinks (onDropdownToggle)="dropdownEventControl($event)"></SamHeaderLinks>

        </div>
      </div>

    </header>
`
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
    this.keyword=$event.keyword;
    this.filterValue=$event.searchField;
    this.searchEvent.emit($event);
  }

  dropdownEventControl(value){
    this.searchHeaderDropdownControl.emit(value);
  }
}
