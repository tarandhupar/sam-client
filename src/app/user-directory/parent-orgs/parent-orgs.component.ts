import {Component, Input} from '@angular/core';

@Component({
  selector: 'parent-orgs',
  template: `
  <div class="usa-grid parent-orgs-row" *ngFor="let level of orgLevels">
    <div class="usa-width-one-fourth">
      <label class="org-level-label text-right">{{level.type}}</label>
    </div>
    <div class="usa-width-three-fourths">
      <a [routerLink]="['/organization', level.id]">{{level.name}}</a>  
    </div>
  </div>
  `
})
export class ParentOrgsComponent {
  @Input() orgLevels: any[];

  constructor() {

  }
}
