import {Component, Input } from '@angular/core';

@Component({
  selector: 'samHeader',
  template:`<header class="sam-header">
              <nav class="" aria-label="Main navigation">
                <div class="usa-width-one-fourth align-top marginCenter p_T-6x centered">
                    <a class="marginCenter">
                      <img class="marginCenter" style="height: 75px; width:75px; padding: 2px 0" src="../../../assets/img/sam_wage_logo.jpg">
                    </a>
                </div>
               
              </nav>
            </header>`,
})
export class SamHeader {

  @Input() labelname;

  constructor() {
  }

  ngOnInit(){
  }

}



