import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'security',
  templateUrl: './security.component.html',
})
export class SecurityComponent extends Section {
  @Input('group') form: FormGroup;
  @Input() submitted: boolean = false;

  private options = {
    typeOfConnection: ['Web Services','SFTP']
  };

  constructor() {
    super();
    this.labels = {
      ipAddress: {
        label: 'IP Address',
        hint: 'Provide the dedicated static IP address used by your system. All system to system requests must come from this IP address.',
      },

      typeOfConnection: {
        label: 'Type of Connection',
        hint: '',
      },

      physicalLocation: {
        label: 'Physical Location',
        hint: '<strong>Example</strong>: <em>The CWS currently resides in Ashburn, VA at XYZ Data Center</em>',
      },

      securityOfficer: {
        label: 'Security Official',
        hint: 'Provide the name and email address of the individual responsible for the security of the interfacing system (the ISSO, for example).',
      },
    }
  };

  errors(key: string = ''): string {
    return this.getError(this.form, key, this.submitted);
  }
}
