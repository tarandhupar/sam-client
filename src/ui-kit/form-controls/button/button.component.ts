import {Component, Input} from '@angular/core';

/**
 * The <samButton> component can generate a button matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input type: the type of the button(default,alt,secondary,outline,gray,disabled,big)
 * @Input labelName: the id that will assign to the button element
 * @Input labelData: the text content that will show on the button
 */
@Component({
  selector: 'samButton',
  template: `<button id={{buttonId}} [ngClass]="btnClass" [disabled]="disabled" >{{buttonData}}</button>`,
})
export class SamButtonComponent {

  @Input() buttonId:string;
  @Input() buttonData:string;
  @Input() buttonType:string;


  disabled: boolean = false;
  btnClass: string = "";
  btnClassMap: any = {
    "default":"",
    alt:"usa-button-primary-alt",
    secondary:"usa-button-secondary",
    gray:"usa-button-gray",
    outline:"usa-button-outline",
    inverted:"usa-button-outline-inverse",
    disabled:"usa-button-disabled",
    big:"usa-button-big"
  };

  constructor() {
  }

  ngOnInit() {
    if(this.btnClassMap.hasOwnProperty(this.buttonType)){
      this.btnClass = this.btnClassMap[this.buttonType];
      if(this.buttonType === "disabled"){
        this.disabled = true;
      }
    }
  }


}

