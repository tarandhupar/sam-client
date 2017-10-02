import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'authorization',
  templateUrl: './authorization.component.html',
})
export class AuthorizationComponent extends Section {
  @Input() form: FormGroup;

  private store = {
    name: '',
    date: '',
  };

  private options = {
    certified: [
      { label: 'I certify that all the information for this system account is current and correct.', name: 'certifed', value: true },
    ]
  }

  constructor() {
    super();
    this.labels = {
      ato: {
        title: 'Authority to Operate',
        hint: 'Upload the current ATO (Authority to Operate) for the interfacing system in PDF formot.',
      },
    }
  };
}
