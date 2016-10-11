import { Component } from '@angular/core';

@Component({
  selector: 'samHeader',
  template:`<header class="sam-header">
              <nav class="" aria-label="Main navigation">
                <div class="usa-width-one-fourth align-top marginCenter centered">
                    <a class="marginCenter">
                      <img class="marginCenter header-logo-img" src="../../../assets/img/sam_hat_logo.jpg">
                    </a>

                </div>
              </nav>
            </header>`,
  styles:[`
    .header-logo-img{
      height: 75px;
      width:75px;
      padding: 2px 0;
    }`]

})
export class SamHeader {

  constructor() {
  }

}



