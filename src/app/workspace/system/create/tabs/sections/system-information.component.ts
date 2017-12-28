import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'system-information',
  templateUrl: './system-information.component.html',
})
export class SystemInformationComponent extends Section {
  @Input('group') form: FormGroup;
  @Input() submitted: boolean = false;

  constructor() {
    super();
    this.labels = {
      systemAccountName: {
        label: 'System Account Name',
        hint: 'Provide a unique name for your new system account.',
      },

      interfacingSystemVersion: {
        label: 'Interfacing System Name and Version',
        hint: 'Provide the name and version of the system that will be connecting to SAM.gov.',
      },

      systemDescriptionAndFunction: {
        label: 'System Description ond Function',
        hint: '<strong>Example</strong>: <em>The IRS stated in a current MOU that their system tracks all incoming commitment requests and captures the information necessary to make awards</em>',
      }
    }
  }

  errors(key: string = ''): string {
    return this.getError(this.form, key, this.submitted);
  }
}
