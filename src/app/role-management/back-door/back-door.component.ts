import { Component } from "@angular/core";
import { Cookie } from "ng2-cookies";

@Component({
  template: `
<div class="usa-grid">
  <div>
    <label>Admin Token</label>
    <select [(ngModel)]="role">
      <option *ngFor='let r of roles' [value]="r">{{r}}</option>
    </select>
  </div>
  <div>
    <button class="usa-button usa-button-primary" (click)="onSetCookiesClick()">Set Cookies</button>
    <button class="usa-button usa-button-secondary" (click)="onClearCookiesClick()">Clear Cookies</button>
  </div>
  <div>
    <sam-alert *ngIf="errors">{{errors}}</sam-alert>
  </div>
</div>
`
})
export class RMBackDoorComponent {
  public roles = [
    'super.role.admin@gsa.gov',
    'department.role.admin@gsa.gov',
    'al.admin@gsa.gov',
    'opp.admin@gsa.gov',
    'fh.super.admin@gsa.gov',
    'fh.department.admin@gsa.gov',
    'fh.agency.admin@gsa.gov',
    'fh.office.admin@gsa.gov',
    'fh.user@gsa.gov',
  ];
  public role;

  constructor() {

  }

  ngOnInit() {

  }

  onSetCookiesClick() {
    if(this.role.startsWith('fh')){
      Cookie.set('superFHToken', this.role, 30, '/');
      return;
    }
    Cookie.set('superToken', this.role, 30, '/');
  }

  onClearCookiesClick() {
    Cookie.delete('superToken');
    Cookie.delete('superFHToken');
  }
}
