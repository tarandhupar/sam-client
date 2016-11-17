import { Component } from '@angular/core';

@Component({
  selector: 'samHeader',
  template:`<header>
              <img src="assets/img/sam_hat_logo.jpg">
            </header>`,
  styles: [ require('./header.scss') ]
})
export class SamHeaderComponent {

  constructor() { }

}
