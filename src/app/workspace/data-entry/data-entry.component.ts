import { Component, Input } from '@angular/core';
import  { Router  } from "@angular/router";

@Component({
  selector: 'workspace-data-entry',
  templateUrl: 'data-entry.template.html'
})
export class DataEntryComponent {

  @Input() toggleControl:any;

  actions: any = {};

  constructor(private router: Router) {}

  setHelpNavigation(fragment) {
    let obj = this.makeObj(fragment);
    this.actions[fragment] = [obj];
    return this.actions[fragment];
  }

  makeObj(fragment) {
    let obj = {
      label: 'Help',
      icon: 'fa fa-question-circle',
      callback: () => { this.router.navigate(['/help/award'], { fragment: fragment}); }
    };

    return obj;
  }
}
