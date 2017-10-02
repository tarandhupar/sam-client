import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'security',
  templateUrl: './security.component.html',
})
export class SecurityComponent extends Section {
  @Input() form: FormGroup;

  private configs = {
    connection: {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  private options = {
    connection: [
      { label: 'Web Services', value: 'web' },
      { label: 'SFTP',         value: 'sftp' },
    ]
  };

  constructor() {
    super();
    this.labels = {
      ipAddress: {
        label: 'IP Address',
        hint: 'Provide the dedicated static IP address used by your system. All system to system requests must come from this IP address.',
      },

      connection: {
        label: 'Type of Connection',
        hint: '',
      },

      location: {
        label: 'Physical Location',
        hint: '<strong>Example</strong>: <em>The CWS currently resides in Ashburn, VA at XYZ Data Center</em>',
      },

      securityOfficer: {
        label: 'Security Official',
        hint: 'Provide the name ond email oddress of the individual responsible for the security of the interfacing system (the ISSO, for example).',
      },
    }
  };
}
