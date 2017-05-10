import {Component, Input, Output, EventEmitter, ViewChild, Renderer, OnChanges} from '@angular/core';
import {SearchOption} from '../interfaces';

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

  @Input()
  selectConfig: any;

  @Output()
  filterValueChange:EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onSearch:EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("filterSelect")
  public filterSelect: any;

  searchBtnText:string = "Search";

  resetIconClass:string = "reset-icon";
  // resetDisabled:boolean = true;

  constructor(private _renderer: Renderer) {
  }

  ngOnInit() {
    if(this.isSizeSmall()){
      this.searchBtnText = "";
    }
  }

  ngAfterViewChecked(changes){
    if(changes && changes.filterValue && changes.filterValue.currentValue){
      this.findSelectedOption(changes.filterValue.currentValue);
    }else{
      this.findSelectedOption(this.filterValue);
    }
  }

  // ngDoCheck(){
  //   this.setResetIconClass();
  // }

  // getLabelForValue(value) {
  //   let option = this.selectConfig.options.find(o => o.value === value);
  //   if (option) {
  //     return option.label;
  //   }
  // }


  onSelect(value):void {
    this.filterValue = value;
    this.filterValueChange.emit(this.filterValue);
    this.findSelectedOption(value);
  }

  findSelectedOption(value): void {
    function getOption(option){
      return option.value === value;
    }
    let selectedOption = this.selectConfig.options.find(getOption);
    if(selectedOption) {
      this.adjustSelectWidth(selectedOption);
    }
  }

  adjustSelectWidth(option): void{
    let containerWidthString = 'width:' + option.width + "px";
    let selectWidth = +option.width + 50;
    let selectWidthString = 'width:' + selectWidth + "px";
    this._renderer.setElementAttribute(this.filterSelect.wrapper.labelDiv.nativeElement, 'style', containerWidthString);
    this._renderer.setElementAttribute(this.filterSelect.select.nativeElement, 'style', selectWidthString);
  }
  
  callSearch(searchTerm):void {
    if(!searchTerm) {
      this.keyword = "";
    } else {
      this.keyword=searchTerm;
    }
  }

  onSearchClick():void{
    this.onSearch.emit({
      keyword: this.keyword == null ? "" : this.keyword,
      searchField: this.filterValue
    });
  }

  isSizeSmall(){
    return this.size === "small";
  }

}
