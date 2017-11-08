import { Component,ViewChild, Input, Output, EventEmitter,forwardRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import * as moment from 'moment/moment';
import int = DataPipeline.int;


@Component ({
  selector: 'sam-select-date-range-filter',
  templateUrl: './sam-select-date-range-filter.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamSelectDateRangeFilterComponent),
    multi: true
  }]
})
export class SamSelectDateRangeFilterComponent implements ControlValueAccessor {

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
  @Input() id: string;
  @Input() filterDisabled;
  @Input() tabIndex;
  @Output() filterEvt: EventEmitter<any> = new EventEmitter();
  @Output() filterClearEvt: EventEmitter<any> = new EventEmitter();
  @ViewChild('wrapper') wrapper;
  model = {
    date:null,
    dateRange:null,
    timeSpan:'',
    timezone:''
  };
  disabled:boolean = false;
  dateFilterModel = {};
  dateTypeFilterModel = 0;
  dateTypeOptions : any = [];
  currDateOption : any  = {};

  ngOnInit(){
    if(this.control){
      this.control.valueChanges.subscribe(()=>{
        this.wrapper.formatErrors(this.control);
      });
      this.wrapper.formatErrors(this.control);
    }
    this.dateTypeOptions = this.setupDateSelectOptions();
  }

  setCurrentDateOption(dateOption : any){
    this.currDateOption = dateOption;
  }

  setupDateSelectOptions(){
    let dateOptionObj = this.dateTypeOptions;
    this.currDateOption = this.tabConfig[this.tabIndex];
    this.tabConfig.forEach((tab, i) => {
      let label = tab.title;
      dateOptionObj.push({'label': label, 'value': i});
    });
    return dateOptionObj;
  }

  filterByDate(){
    this.filterEvt.emit({
      index: this.dateTypeFilterModel,
      data: this.currDateOption
    });
  }

  selectChangeHandler(event){
    this.onTouched();
    this.dateTypeFilterModel = event;
    this.currDateOption = this.tabConfig[event];
    this.onChange(this.currDateOption);
  }

  dateChangeHandler(evt){
    this.onTouched();
    this.dateFilterModel=evt;
    this.onChange(this.dateFilterModel);
  }

  clearDateFilter(){
    this.filterClearEvt.emit({
      index: this.dateTypeFilterModel,
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
