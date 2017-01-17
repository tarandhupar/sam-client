import { Component } from '@angular/core';

/**
 * The <samLabel> component can generate a label matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input labelType: string - 'small': display small label
 *                       'big': display big label
 * @Input labelText: the text content that will show on the label
 */
@Component({
  selector: 'sam-spinner',
  template: `<i class="fa fa-spinner fa-pulse fa-2x"></i>`,
})
export class SamSpinnerComponent {

}


