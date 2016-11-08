import { Component } from '@angular/core';

@Component({
  selector: 'samHeader',
  template:`<header class="sam-header clearfix">
              <nav class="" aria-label="Main navigation">
                <div class="usa-width-one-fourth align-top marginCenter centered">
                    <a class="marginCenter">
                      <img class="marginCenter header-logo-img" src="assets/img/sam_hat_logo.jpg">
                    </a>
                </div>
              </nav>
            </header>`,
  styleUrls: ['header.scss']
})
export class SamHeaderComponent {

  constructor() { }

}
