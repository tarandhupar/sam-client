import {Component, Input, Output, EventEmitter, ViewChild, Renderer} from '@angular/core';

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
  
  @ViewChild("filterSelect")
  public filterSelect: any;

  searchBtnText:string = "Search";
  
  // Added "width" as a temporary solution to find width of selected text
  // Ideally select width needs to be calculated automatically based on
  // character length and character width of selected text;
  selectConfig = {
    options: [
      {value: '', label: 'All', width: '60px'},
      {value: 'opp', label: 'Opportunities', width: '140px'},
      {value: 'cfda', label: 'Assistance Listings', width: '180px'},
      {value: 'fh', label: 'Federal Hierarchy', width: '170px'},
      {value: 'ent', label: 'Entities', width: '100px'},
      {value: 'ex', label: 'Exclusions', width: '120px'},
      {value: 'wd', label: 'Wage Determinations', width: '200px'}
    ],
    disabled: false,
    label: '',
    name: 'filter',
  };

  resetIconClass:string = "reset-icon";
  // resetDisabled:boolean = true;

  constructor(private _renderer: Renderer) {
  }

  ngOnInit() {
    if(this.isSizeSmall()){
      this.searchBtnText = "";
    }
    this.findSelectedOption('');
  }

  // ngDoCheck(){
  //   this.setResetIconClass();
  // }

  getLabelForValue(value) {
    let option = this.selectConfig.options.find(o => o.value === value);
    if (option) {
      return option.label;
    }
  }


  onSelect(value):void {
    this.filterValue = value;
    this.findSelectedOption(value);
  }
  
  // Makes "all" the default value for select
  selectModel = ""; 
  
  findSelectedOption(value): void {
    function getOption(option){
      return option.value === value;
    }
    let selectedOption = this.selectConfig.options.find(getOption);
    this.adjustSelectWidth(selectedOption);
  }
  
  adjustSelectWidth(option): void{
    let widthString = 'width:' + option.width;
    this._renderer.setElementAttribute(this.filterSelect.select.nativeElement, 'style', widthString);
  }

  callSearch(searchTerm):void {
    this.keyword=searchTerm;
  }

  onSearchClick():void{
    this.onSearch.emit({
      keyword: this.keyword,
      searchField: this.filterValue
    });
  }

  isSizeSmall(){
    return this.size === "small";
  }

}
