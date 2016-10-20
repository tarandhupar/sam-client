import { Component, Input } from '@angular/core';


@Component({
  selector: 'samAccordions',
  template:`<div id={{labelName}} [innerHTML]='html'></div>`,
})
export class SamAccordionsComponent {

  @Input() labelName: string;
  @Input() config: any;


  constructor() {
  }

  ngOnInit(){
  }
}
