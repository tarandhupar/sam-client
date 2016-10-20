import { Component, Input } from '@angular/core';

/**
 * The <samAlert> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input type: Set alert type, defaults to 'success'
 * @Input title: Set alert title
 * @Input description: Set alert description
 */
@Component({
  selector: 'samAlert',
  templateUrl: './alert.template.html'

})
export class SamAlertComponent {
  @Input() type: string;
  @Input() title: string;
  @Input() description: string;
  types:any = {
    "success":"usa-alert-success",
    "warning":"usa-alert-warning",
    "error":"usa-alert-error",
    "info":"usa-alert-info"
  }
  selectedType: string = this.types['success'];
  constructor() {
  }

  ngOnInit(){
    if(!this.typeNotDefined()){

      this.selectedType = this.types[this.type];
    }
  }

  typeNotDefined(){
    if(!this.type || this.type.length==0){
      return true;
    }
    if(!this.types[this.type]){
      return true;
    }
    return false;
  }

}
