import { Component,ViewChild, Input, Output, EventEmitter,forwardRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import * as moment from 'moment/moment';
import int = DataPipeline.int;


@Component ({
  selector: 'sam-tab-date-range-filter',
  templateUrl: './sam-tab-date-range-filter.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamTabDateRangeFilterComponent),
    multi: true
  }]
})
export class SamTabDateRangeFilterComponent implements ControlValueAccessor {

  @Input() tabConfig: {
    title: string,
    timezoneOptions?: any,
    timeSpanOptions?: any,
    dateRadioOptions?: any,
    radioSelection?: string,
    rangeType?: string,
    label?: string,
    radioName?: string,
    dateFilterConfig?: any
  }[] = [];
 
  /**
   * Passes in the Angular FormControl
   */
  @Input() control: FormControl;
  @Input() tabIndex: number = 0;
  @Input() filterDisabled;
  @Output() filterEvt: EventEmitter<any> = new EventEmitter();
  @Output() filterClearEvt: EventEmitter<any> = new EventEmitter();
  @Output() tabIndexChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('wrapper') wrapper;
  model = {
    date:null,
    dateRange:null,
    timeSpan:"",
    timezone:""
  };
  disabled:boolean = false;
  dateFilterModel = [];
  selectedIndex = 0;

  ngOnInit(){
    if(this.control){
      this.control.valueChanges.subscribe(()=>{
        this.wrapper.formatErrors(this.control);
      });
      this.wrapper.formatErrors(this.control);
    }
    this.dateFilterModel.length = this.tabConfig.length;
  }

  ngOnChanges(c){
    if(c["tabIndex"] && this.tabIndex > this.tabConfig.length && this.tabIndex < 0){
      this.tabIndex = 0;
      this.selectedIndex = this.tabIndex;
    }
    else if(c["tabIndex"]){
      this.selectedIndex = this.tabIndex;
    }
  }

  selectTab(i: int = 0){
    this.selectedIndex = i;
    this.tabIndexChange.emit(this.selectedIndex);
  }

  getColorClass(i: int){
    if(i === this.selectedIndex){
      return 'active';
    }
    return '';
  }

  filterByDate(){
    this.filterEvt.emit({
      index: this.selectedIndex,
      data: this.dateFilterModel
    });
  }
  changeHandler(evt){
    this.onTouched();
    this.dateFilterModel[this.selectedIndex]=evt;
    this.onChange(this.dateFilterModel);
  }

  clearDateFilter(){
    this.filterClearEvt.emit({
      index: this.selectedIndex
    });
  }

  onChange: any = (_any) => { };
  onTouched: any = () => { };

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    if(value){
      this.dateFilterModel = value;
    }
  }
}
