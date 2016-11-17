import {Component, Input, Output, EventEmitter} from '@angular/core';

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
  templateUrl: 'searchbar.template.html',
  styles: [ require('./searchbar.style.css') ],

})
export class SamSearchbarComponent {


  @Input()
  size: string;

  @Input()
  keyword: string = "";

  @Input()
  placeholder: string = "";

  @Input()
  filterValue: string = "";


  @Output()
  onSearch:EventEmitter<any> = new EventEmitter<any>();

  searchBtnText:string = "Search";

  selectConfig = {
    options: [
      {value: '', label: 'All'},
      {value: 'fbo', label: 'Opportunities'},
      {value: 'cfda', label: 'Assistance Listings'},
      {value: 'fh', label: 'Federal Hierarchy'},
      {value: 'ent', label: 'Entities'}
    ],
    disabled: false,
    label: '',
    name: 'filter',
  };

  resetIconClass:string = "reset-icon";
  resetDisabled:boolean = true;

  constructor() {
  }

  ngOnInit() {
    if(this.isSizeSmall()){
      this.searchBtnText = "";
    }
  }

  ngDoCheck(){
    this.setResetIconClass();
  }

  getLabelForValue(value) {
    let option = this.selectConfig.options.find(o => o.value === value);
    if (option) {
      return option.label;
    }
  }


  onSelect(value):void {
    this.filterValue = value;
  }

  onSearchClick():void{
    this.onSearch.emit({
      keyword:this.keyword,
      searchField: this.filterValue
    });
  }

  onKeywordChange(){
    this.setResetIconClass();
  }

  onResetClick(){
    if(!this.resetDisabled){
      this.keyword = "";
      this.setResetIconClass();
    }
  }

  setResetIconClass(){
    if(this.keyword === undefined || this.keyword.length === 0){
      this.resetIconClass = "reset-icon";
      this.resetDisabled = true;
    }else{
      this.resetIconClass = "reset-icon-active";
      this.resetDisabled = false;
    }
  }

  isSizeSmall(){
    return this.size === "small";
  }

}
