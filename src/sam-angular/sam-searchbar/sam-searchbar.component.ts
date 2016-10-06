import {Component, ElementRef, Input, Output, ViewChild, EventEmitter} from '@angular/core';

/**
 * The <samSearchbar> component(filter,input bar and search button) can automatically change it size according to the div the wrap it.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input size: string - 'small': show only the search icon on the search btn
 *                       'large': show the 'Search' text on the search btn
 */
@Component({
  selector: 'samSearchbar',
  templateUrl: './sam-searchbar.template.html',
  styleUrls: ['./searchbar.style.css'],

})
export class SamSearchbarComponent {

  @Input()
  size: string;

  @Output()
  selectChange:EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('searchbtn')
  searchbtn:ElementRef;
  @ViewChild('wholediv')
  wholediv:ElementRef;
  @ViewChild('filter')
  filter:ElementRef;

  searchBtnText:string = "Search";
  inputbarWidth:any = 500;

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
    console.log(this.searchBtnText);
    setTimeout(()=>this.adjustInputBar());

  }

  /**
   * Change the filter label value when select, and adjust the input bar width if necessary
   * @param value
   */
  onSelect(value):void {
    this.filterValue = value;
    this.selectChange.emit(this.filterValue);
    setTimeout(()=>this.adjustInputBar());
  }

  /**
   * Adjust the input bar width according to the width of the filter label width and search btn width
   */
  adjustInputBar():void {
    this.inputbarWidth = this.wholediv.nativeElement.offsetWidth
                          - this.searchbtn.nativeElement.offsetWidth
                          - this.filter.nativeElement.offsetWidth;
  }

}
