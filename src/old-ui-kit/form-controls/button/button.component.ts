import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The <samButton> component can generate a button matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input buttonType: the type of the button(default,alt,secondary,outline,gray,disabled,big)
 * @Input buttonId: the id that will assign to the button element
 * @Input buttonText: the text content that will show on the button
 */
@Component({
  selector: 'samButton',
  template: `<button type="button" [attr.id]="buttonId" [ngClass]="btnClass" [disabled]="disabled" (click)="click($event)" [innerText]="buttonText"></button>`,
})
export class SamButtonComponent {
  @Input() buttonId:string = null;
  @Input() buttonText:string;
  @Input() buttonType:string;
  @Input() buttonClass:string = '';

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  private btnClassMap:any = {
    default:   "",
    alt:       "usa-button-primary-alt",
    secondary: "usa-button-secondary",
    gray:      "usa-button-gray",
    outline:   "usa-button-outline",
    inverted:  "usa-button-outline-inverse",
    disabled:  "usa-button-disabled",
    big:       "usa-button-big"
  };

  disabled: boolean = false;

  get btnClass():String {
    let classMap = [];

    if(this.btnClassMap.hasOwnProperty(this.buttonType)){
      this.disabled = (this.buttonType === 'disabled');
      classMap.push(this.btnClassMap[this.buttonType]);
    }

    if(this.buttonClass.length) {
      classMap.push(this.buttonClass);
    }

    return classMap.join(' ');
  }

  click($event) {
    this.onClick.emit($event);
  }
}
