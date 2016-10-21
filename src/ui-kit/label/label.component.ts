import {Component, Input} from '@angular/core';

/**
 * The <samLabel> component can generate a label matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input labelType: string - 'small': display small label
 *                       'big': display big label
 * @Input labeId: the id that will assign to the label element
 * @Input labelData: the text content that will show on the label
 */
@Component({
  selector: 'samLabel',
  template: `<span id={{labelId}} [ngClass]="labelClass()">{{labelData}}</span>`,
})
export class SamLabelComponent {

  @Input() labelId:string;
  @Input() labelType:string;
  @Input() labelData:string;


  constructor() {

  }

  ngOnInit() {
  }

  /**
   * Set up the SAMWDS class for the label according to the size of the label
   */
  private labelClass():string{
    if(this.labelType === "small"){
      return 'usa-label' ;
    } else if(this.labelType === "big") {
      return 'usa-label-big';
    }
  }


}


