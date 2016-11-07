import { Component, Input } from '@angular/core';

@Component({
  selector: 'samFooter',
  templateUrl:'footer.template.html',

  styles: [
    '.sam-footer-head{color: #fff}',
    '.sam-footer-links{font-size:13px}'
  ]
})
export class SamFooterComponent {

  @Input() labelname: string;
  
  constructor() {
  }

  ngOnInit(){
  }
}
