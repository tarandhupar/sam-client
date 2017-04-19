import { Component, Input, forwardRef, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'falTAFSInput',
  templateUrl: 'tafs.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALTafsComponent),
      multi: true
    }
  ]
})
export class FALTafsComponent implements ControlValueAccessor {
  //todo: refactor model duplication
  private currentIndex: number = 0;

  public model = {
    departmentCode: '',
    accountCode: '',
    subAccountCode: '',
    allocationTransferAgency: '',
    fy1: '',
    fy2: '',
    tafs: []
  };

  // general
  @Input() options; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;
  public showForm: boolean = false;

  // tafs
  private tafsFormGroup;

  @ViewChild('tafsLabel') tafsWrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
  }

  private parseInputsAndSetDefaults() {
    // inputs can either be passed directly, or through an options object
    // if an input is passed both ways, the value passed directly will take precedence
    if(this.options) {
      this.name = this.name || this.options.name;

      this.label = this.label || this.options.label;
      this.hint = this.hint || this.options.hint;
      if(this.required == null) { this.required = this.options.required }
    }

    // subcomponent names are generated based on this component's name within html template
  }

  private validateInputs() {
    let errorPrefix = "<falTAFSInput> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.tafsFormGroup = new FormGroup({
      departmentCode: new FormControl(null, Validators.pattern('[0-9]*')),
      accountCode: new FormControl(null, Validators.pattern('[0-9]*')),
      subAccountCode: new FormControl(null, Validators.pattern('[0-9]*')),
      allocationTransferAgency: new FormControl(null, Validators.pattern('[0-9]*')),
      fy1: new FormControl(null, Validators.pattern('[0-9]*')),
      fy2: new FormControl(null, Validators.pattern('[0-9]*'))
    });

    this.tafsFormGroup.get('departmentCode').valueChanges.subscribe(value => {
      this.model.departmentCode = value;
      this.onChange();
    });

    this.tafsFormGroup.get('accountCode').valueChanges.subscribe(value => {
      this.model.accountCode = value;
      this.onChange();
    });

    this.tafsFormGroup.get('subAccountCode').valueChanges.subscribe(value => {
      this.model.subAccountCode = value;
      this.onChange();
    });

    this.tafsFormGroup.get('allocationTransferAgency').valueChanges.subscribe(value => {
      this.model.allocationTransferAgency = value;
      this.onChange();
    });

    this.tafsFormGroup.get('fy1').valueChanges.subscribe(value => {
      this.model.fy1 = value;
      this.onChange();
    });

    this.tafsFormGroup.get('fy2').valueChanges.subscribe(value => {
      this.model.fy2 = value;
      this.onChange();
    });
  }

  public displayForm() {
    this.showForm = true;
  }

  public resetForm() {
    this.currentIndex = this.model.tafs.length;
    this.tafsFormGroup.reset();
    this.showForm = false;

    this.onChange();
  }

  public addTafs() {
    let tafs = {};

    tafs['departmentCode'] = this.model.departmentCode;
    tafs['accountCode'] = this.model.accountCode;
    tafs['subAccountCode'] = this.model.subAccountCode;
    tafs['allocationTransferAgency'] = this.model.allocationTransferAgency;
    tafs['fy1'] = this.model.fy1;
    tafs['fy2'] = this.model.fy2;

    this.model.tafs[this.currentIndex] = tafs;
    this.resetForm();
  }

  public editTafs(index: number) {
    let tafs = this.model.tafs[index];

    this.tafsFormGroup.get('departmentCode').setValue(tafs.departmentCode);
    this.tafsFormGroup.get('accountCode').setValue(tafs.accountCode);
    this.tafsFormGroup.get('subAccountCode').setValue(tafs.subAccountCode);
    this.tafsFormGroup.get('allocationTransferAgency').setValue(tafs.allocationTransferAgency);
    this.tafsFormGroup.get('fy1').setValue(tafs.fy1);
    this.tafsFormGroup.get('fy2').setValue(tafs.fy2);

    this.currentIndex = index;
    this.showForm = true;
  }

  public removeTafs(index: number) {
    this.model.tafs.splice(index, 1);
    if(index === this.currentIndex) {
      this.tafsFormGroup.reset();
      this.currentIndex = this.model.tafs.length;
    } else if(index < this.currentIndex) {
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
    if(obj) {
      this.model = obj;
      this.currentIndex = this.model.tafs.length;

      this.onChange();
    }
  }
}
