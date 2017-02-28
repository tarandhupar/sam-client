import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samHeader',
  template: `<header>
              <nav class="usa-grid-full" aria-label="Main navigation">
                <div class="usa-width-one-fourth align-top">
                  <ul class="usa-grid usa-unstyled-list">
                    <li><a class="logo-link" tabindex="0" (click)="refreshPage()" (keyup.enter)="refreshPage()"><img src="src/assets/img/transition-sam-logo.png"  alt="Transition.sam.gov Logo"></a></li>
                  </ul>
                </div>
                <ng-content select="[header-links]"></ng-content>
              </nav>
            </header>`,
})
export class SamHeaderComponent {
  constructor() { }

  refreshPage(){
    window.location.reload();
  }
}