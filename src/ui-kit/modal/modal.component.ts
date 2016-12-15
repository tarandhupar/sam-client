import { Component, Input, Output, EventEmitter } from '@angular/core';
/**
 * The <samModal> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 */

@Component({
  selector: 'samModal',
  templateUrl: './modal.template.html'
})
export class SamModalComponent {
  @Input() id = "";
  @Input() startOpen = false;
  @Input() config: {};
  @Input() type: string;
  @Input() title: string;
  @Input() description: string;
  @Input() showClose: boolean = false;
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();
  show = false;

  types:any = {
    "success":"usa-alert-success",
    "warning":"usa-alert-warning",
    "error":"usa-alert-error",
    "info":"usa-alert-info"
  };
  selectedType: string = this.types['success'];

  constructor() { }

  ngOnInit(){
    if(!this.typeNotDefined()){
      this.selectedType = this.types[this.config['type']];
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

  onDismissClick(){
    this.show = false;
    this.dismiss.emit();
  }

  preventClosing(evt){
    evt.stopPropagation();
  }
}
