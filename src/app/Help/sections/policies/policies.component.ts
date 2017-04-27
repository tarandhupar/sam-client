import { Component } from '@angular/core';
import { globals } from '../../../../app/globals.ts';

@Component({
  providers: [ ],
  templateUrl: './policies.template.html',
})
export class PoliciesComponent {

  constructor() { }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
