import { Component, Input, forwardRef, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { OptionsType } from "sam-ui-kit/types";

@Component({
  selector: 'falFYTable',
  templateUrl: 'fiscal-year-table.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALFiscalYearTableComponent),
      multi: true
    }
  ]
})
export class FALFiscalYearTableComponent implements ControlValueAccessor {
  @Input() options; // all inputs are passed through a single options object
  public name: string;
  public label: string;
  public hint: string;
  public required: boolean;

  public checkboxOptions: OptionsType[];
  public yearOptions: OptionsType[];

  private model: any = {
    checkbox: [],
    entries: []
  }; // internally maintained model - should never be null or undefined
  public fyTableGroup: FormGroup;

  public showForm: boolean = false;
  public currentIndex: number = 0;

  @ViewChild('fyTableWrapper') fyTableWrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
  }

  private parseInputsAndSetDefaults() {
    if(this.options) {
      this.name = this.options.name;
      this.label = this.options.label;
      this.hint = this.options.hint;
      this.required = this.options.required;

      if(this.options.checkbox) {
        this.checkboxOptions = this.options.checkbox.options;
      }
    }

    if(this.required == null) {
      this.required = false;
    }

    // todo: don't hardcode years
    this.yearOptions = [
      { value: '2016', label: '2016', name: 'funded-projects-2016' },
      { value: '2017', label: '2017', name: 'funded-projects-2017' },
      { value: '2018', label: '2018', name: 'funded-projects-2018' }
    ];
  }

  private validateInputs() {
    let errorPrefix = "<falFYTable> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.fyTableGroup = new FormGroup({
      naCheckbox: new FormControl([]),
      textarea: new FormControl(''),
      year: new FormControl('')
    });

    this.fyTableGroup.get('naCheckbox').valueChanges.subscribe(value => {
      this.model.checkbox = value;
      this.onChange();
    });

    this.fyTableGroup.get('textarea').valueChanges.subscribe(value => {
      this.model.textarea = value;
      this.onChange();
    });

    this.fyTableGroup.get('year').valueChanges.subscribe(value => {
      this.model.year = value;
      this.onChange();
    });
  }

  public displayForm() {
    this.showForm = true;
  }

  public resetForm() {
    this.currentIndex = this.model.entries.length;
    this.fyTableGroup.reset();
    this.showForm = false;

    this.onChange();
  }

  public addEntry() {
    let fyEntry: any = {};

    fyEntry.year = this.model.year;
    fyEntry.text = this.model.textarea;

    this.model.entries[this.currentIndex] = fyEntry;
    this.resetForm();
  }

  public editEntry(index: number) {
    let entry = this.model.entries[index];

    this.fyTableGroup.get('textarea').setValue(entry.text);
    this.fyTableGroup.get('year').setValue(entry.year);

    this.currentIndex = index;
    this.showForm = true;
  }

  public removeEntry(index: number) {
    this.model.entries.splice(index, 1);
    if(index < this.currentIndex) {
      this.currentIndex--;
    }

    this.onChange();
  }

  private onChange() {
    this.onChangeCallback(this.model);
  }

  private onChangeCallback: any = (_: any) => {};
  private onTouchedCallback: any = () => {};

  public registerOnChange(fn: any) : void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) : void {
    this.onTouchedCallback = fn;
  }

  public writeValue(obj: any) : void {
    if(obj == null) {
      obj = {};
    }

    this.model = obj;

    if(this.model.entries == null) {
      this.model.entries = [];
    }

    if(this.model.checkbox) {
      this.fyTableGroup.get('naCheckbox').setValue(this.model.checkbox);
    }

    if(this.model.textarea) {
      this.fyTableGroup.get('textarea').setValue(this.model.textarea);
    }

    if(this.model.year) {
      this.fyTableGroup.get('year').setValue(this.model.year);
    }

    this.onChange();
  }

  public setDisabledState(isDisabled: boolean) : void {}
}
