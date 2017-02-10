import { Component, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import { SamSearchbarComponent } from '../form-controls/searchbar/searchbar.component';

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
              <samSearchbar #searchbar
                [size]="'small'" 
                (onSearch)="onSearchEvent($event)"
                [filterValue]="filterValue">
                <div custom-input>
                  <ng-content select="[header-search-input]"></ng-content>
                </div>
              </samSearchbar>
            </div>
          </div>
        </div>
        <div class="usa-width-one-third m_L-2x">
          <div class="pull-right">
            <img title="An official website of the United States Government"
               src="src/assets/img/us_flag_small.png" alt="US Flag Logo"/>
          </div>
          <ng-content select="[header-links]"></ng-content>
        </div>
      </div>
    </header>
`
})
export class SamSearchHeaderComponent {

  @Input() keyword: string;

  @Input() filterValue: string;

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('searchbar') searchbar: SamSearchbarComponent;
  constructor() { }

  ngOnInit(){
  }

  onSearchEvent($event) {
    this.keyword=$event.keyword;
    this.filterValue=$event.searchField;
    this.searchEvent.emit($event);
  }

}
