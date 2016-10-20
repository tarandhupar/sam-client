import {Component, Input} from '@angular/core';

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

