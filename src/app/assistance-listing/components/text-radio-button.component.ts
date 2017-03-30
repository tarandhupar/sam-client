import {Component, Input, ViewChild, Output, EventEmitter, forwardRef} from '@angular/core';
import {SamRadioButtonComponent} from "sam-ui-elements/src/ui-kit/form-controls/radiobutton";
import {FormControl, ControlValueAccessor, Validators, NG_VALUE_ACCESSOR} from "@angular/forms";
import { FieldsetWrapper } from '../../../sam-ui-elements/src/ui-kit/wrappers/fieldset-wrapper';
import { SamTextInputModule } from '../../../sam-ui-elements/src/ui-kit/form-controls/text';
import {OptionsType} from "sam-ui-kit/types";


export class modelData{
  radioOptionId: string
  textboxValue: string
};

@Component({
  selector: 'samTextRadioButton',
  templateUrl: "text-radio-button.template.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamTextRadioButtonComponent),
      multi: true
    }
  ]
})

export class SamTextRadioButtonComponent  implements ControlValueAccessor {


  /**
   * Sets the bound value of the component
   */
  @Input() model: modelData;
  /**
   * Sets the array of checkbox values and labels (see OptionsType)
   */
  @Input() options: OptionsType[];

  /**
   * Sets the label text
   */
  @Input() label: string;
  /**
   * Sets the semantic description for the component
   */
  @Input() name: string;
  /**
   * Sets the helpful text for the using the component
   */
  @Input() hint: string;
  /**
   * Sets the general error message
   */
  @Input() errorMessage: string;
  /**
   * Event emitted when model value changes
   */
  @Output() modelChange: EventEmitter<modelData> = new EventEmitter<modelData>();


  public textBoxControl: FormControl;

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;


  @ViewChild(SamTextInputModule) _textBoxControl: SamTextInputModule;

  constructor() {
   this.model = new modelData();
  }

 ngOnChanges(event: any){
  if(event.model){
    this.model = event.model;
  }
}

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samTextRadioButton> requires a [name] parameter for 508 compliance");
    }
    this.createtextBoxControl();
  }

  onRadioOptionChange(value) {
    this.model.radioOptionId = value;
    this.createtextBoxControl();
     this.onChange(this.model);
  }

  private createtextBoxControl() {
    this.textBoxControl = new FormControl();
    this.textBoxControl.valueChanges.subscribe(value => {
      this.model.textboxValue = value;
      this.onChange(this.model);
    });

  }
  private onChange: any = (_: any) => {};
  private onTouchedCallback: any = () => {};

  public registerOnChange(fn: any) : void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) : void {
    this.onTouchedCallback = fn;
  }

  public writeValue(obj: any) : void {
    console.log("obj",obj);
    if(obj) {
      this.model = obj;

      if(!this.model.radioOptionId) {
        this.model.radioOptionId = '';
      }
      if(!this.model.textboxValue) {
        this.model.textboxValue = '';
      }
      this.textBoxControl.setValue(this.model.textboxValue);
      this.onChange(this.model);
    }
  }
}

