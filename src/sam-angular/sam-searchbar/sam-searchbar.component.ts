import {Component, ElementRef, Input, Output, ViewChild, EventEmitter} from '@angular/core';

/**
 * The <samSearchbar> component(filter,input bar and search button) can automatically change it size according to the div the wrap it.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input size: string - 'small': show only the search icon on the search btn
 *                       'large': show the 'Search' text on the search btn
 * @Output onSearch: output the search object that contains keyword and searchField(filter value)
 */
@Component({
  selector: 'samSearchbar',
  templateUrl: './sam-searchbar.template.html',
  styleUrls: ['./searchbar.style.css'],

})
export class SamSearchbarComponent {


  @Input()
  size: string;

  @Input()
  keyword: string;

  @Input()
  placeholder: string;

  @Output()
  onSearch:EventEmitter<any> = new EventEmitter<any>();

  searchIndices = {
    'All':'',
    'Opportunities':'cfda',
    'Assistance Listings':'fbo'
  }
  searchBtnText:string = "Search";
  filterValue:string = "All";

  selectConfig = {
    options: [
      {value: 'All', label: 'All', name: 'All'},
      {value: 'Opportunities', label: 'Opportunities', name: 'Opportunities'},
      {value: 'Assistance Listings', label: 'Assistance Listings', name: 'Assistance Listings'},
    ],
    disabled: false,
    label: '',
    name: 'filter',
  };

  constructor() {
  }

  ngOnInit() {
    if(this.size === "small"){
      this.searchBtnText = "";
    }
  }

  onSelect(value):void {
    this.filterValue = value;
  }

  onSearchClick():void{
    this.onSearch.emit({
      keyword:this.keyword,
      searchField: this.searchIndices[this.filterValue]
    });
  }

}
