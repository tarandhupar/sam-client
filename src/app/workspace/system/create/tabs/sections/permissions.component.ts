import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'permissions',
  templateUrl: 'permissions.component.html',
})
export class PermissionsComponent extends Section {
  @Input('group') form: FormGroup;

  private options = {
    'contract-opportunities': [
      { label: 'Read',           name: 'co-read',           value: 'read' },
      { label: 'Read Sensitive', name: 'co-read-sensitive', value: 'read-sensitive' },
      { label: 'Write',          name: 'co-write',          value: 'write' },
    ],

    'contract-data': [
      { label: 'Read',     name: 'cd-read',     value: 'read' },
      { label: 'Write',    name: 'cd-write',    value: 'write' },
      { label: 'DoD Data', name: 'cd-dod-data', value: 'dod-data' },
    ],

    'entity-information': [
      { label: 'Read Public',    name: 'ei-read-public',    value: 'read-public' },
      { label: 'Read FOUO',      name: 'ei-read-fouo',      value: 'read-fouo' },
      { label: 'Read Sensitive', name: 'ei-read-sensitive', value: 'read-sensitive' },
    ],

    'FIPS199Categorization': ['Low','Medium','High']
  };

  private keys = {
    'contract-opportunities': 'contractOpportunities',
    'contract-data': 'contractData',
    'entity-information': 'entityInformation',
  };

  constructor() {
    super();
    this.labels = {
      permissions: {
        label: 'Permissions',
        hint: 'What permissions do you need?',
      },

      FIPS199Categorization: {
        label: 'Overall FIPS 199 Categorization',
        hint: '',
      }
    };
  }

  titleize(value: string) {
    let list = value.split('-');

    return list
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
