import {Component, Input} from '@angular/core';

@Component({
  selector: 'parent-orgs',
  template: `
  <div class="usa-grid parent-orgs-row" *ngFor="let i of [1,2,3]">
    <div class="usa-width-one-sixth">
      <label class="text-right">Org Type</label>
    </div>
    <div class="usa-width-five-sixths">
      <span>Org name</span>  
    </div>
  </div>
  `
})

export class ParentOrgsComponent {
  @Input() orgNames: string[];
  @Input() orgTypes: string[];

  constructor() {

  }

  ngOnInit() {
    if (this.orgNames.length !== this.orgTypes.length) {
      console.error('Expected [orgNames] and [orgTypes] to be the same length');
    }
  }
}
