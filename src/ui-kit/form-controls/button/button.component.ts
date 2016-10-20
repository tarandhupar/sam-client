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
  template: `<button id={{labelName}} [ngClass]="btnClass" [disabled]="disabled" >{{labelData}}</button>`,
})
export class SamButtonComponent {

  @Input() labelName:string;
  @Input() labelData:string;
  @Input() type:string;


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
    if(this.btnClassMap.hasOwnProperty(this.type)){
      this.btnClass = this.btnClassMap[this.type];
      if(this.type === "disabled"){
        this.disabled = true;
      }
    }
  }


}

