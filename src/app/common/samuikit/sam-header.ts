import {Component, Input } from '@angular/core';

@Component({
  selector: 'samHeader',
  template:`<header class="sam-header">
              <nav class="" aria-label="Main navigation">
              
                <div class="usa-width-one-fourth align-top marginCenter p_T-6x">
                    <div class="usa-width-one-half marginCenter">
                          <a class="sam-home marginCenter">
                          </a>
                    </div>
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



