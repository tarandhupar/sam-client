import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators,
  AbstractControl, NG_VALIDATORS, Validator,FormBuilder
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-elements/src/ui-kit/wrappers/label-wrapper";
import { ValidationErrors } from "../../../app-utils/types";

@Component({
  selector: 'fal-account-identification-code',
  template:`
<sam-label-wrapper #wrapper
    [name]="name"
    [label]="label"
    [hint]="hint"
    [required]="required">
    <div class="usa-grid-full">
        <div class="usa-width-one-whole" [formGroup]="codeForm">
        <ng-container *ngFor="let length of codePartLengths; let i = index; let isLast = last">
            <!-- todo: don't hardcode maxwidth -->
            <div [style.display]="'inline-block'" [style.maxWidth]="0.9*length + 3 + 'rem'">
                <input class="vertical-center"
                       [attr.aria-label]="'Code part ' + (i+1)"
                       [attr.id]="'code-box' + i"
                       [attr.maxlength]="length"
                       [formControlName]="'codePart' + i"
                       (keydown)="onKeyDown($event,i)"
                       (change)="changeHandler()"
                />
            </div>
            <span class="vertical-center" *ngIf="!isLast">-</span>
        </ng-container>
        </div>
    </div>
</sam-label-wrapper>`,
    providers:[{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALAccountIdentificationCodeComponent),
      multi: true
    }]
})
export class FALAccountIdentificationCodeComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() hint: string;
    @Input() name: string;
    @Input() required: boolean;
    @Input() control: FormControl;
    codePartLengths: number[] = [2, 4, 1, 1, 3];
    @ViewChild('wrapper') wrapper;
    public codeForm: FormGroup;

    constructor(private fb:FormBuilder){}
    ngOnInit(){
        this.codeForm = this.fb.group({
            codePart0:"",
            codePart1:"",
            codePart2:"",
            codePart3:"",
            codePart4:"",
        });
        if(this.control){
            this.control.valueChanges.subscribe(()=>{
                this.wrapper.formatErrors(this.control);
            });
            this.wrapper.formatErrors(this.control);
        }
    }
    /** Event handlers **/

    // Modified version of code originally by Joseph Lennox
    // http://stackoverflow.com/a/15595732
    // todo: fix edge cases (tab is broken)
    public onKeyDown(event) {
        if(event.key.match(/[0-9]/)==null && ['Tab','Backspace','Delete','ArrowRight','ArrowLeft'].indexOf(event.key)==-1){
            event.preventDefault();
            return;
        }
        let target = event.srcElement || event.target;
        let maxLength = parseInt(target.attributes["maxlength"].value, 10);
        let currentLength = target.value.length;
        let node = target.parentNode;
        // When typing into code part inputs, focus on the next or previous input automatically
        if (currentLength >= maxLength || currentLength === 0) {
            while (node != null) {
                if (!isNaN(event.key) && currentLength >= maxLength) {
                    node = node.nextElementSibling;
                } else if (currentLength === 0 && (event.code=="Backspace"||event.code=="Delete")) {
                    node = node.previousElementSibling;
                }

                if (node && node.tagName.toLowerCase() === "div") {
                    node.getElementsByTagName('input')[0].focus();
                    break;
                }
            }
        }

    }

    public changeHandler(){
        this.onChangeCallback(this.toString());
    }

    toString(){
        let model = this.codeForm.value;
        if(model.codePart0 !== "" || model.codePart1 !== "" || model.codePart2 !== "" || model.codePart3 !== "" || model.codePart4 !== "") {
          return model.codePart0 + "-" + model.codePart1 + "-" + model.codePart2 + "-" + model.codePart3 + "-" + model.codePart4;
        } else {
          return '';
        }
    }

    /** Implement ControlValueAccessor interface **/

    private onChangeCallback: any = (_: any) => {
    };
    private onTouchedCallback: any = () => {
    };

    public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
    }

    public writeValue(obj: string): void {
        let splitStr = obj.split("-");
        let tempModel = {};
        for(let idx in splitStr){
            tempModel['codePart'+idx]=splitStr[idx];
        }
        this.codeForm.patchValue(tempModel);
    }

    public setDisabledState(isDisabled: boolean): void {
    // todo...
    }
}
