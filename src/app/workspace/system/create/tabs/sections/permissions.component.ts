import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Section } from './section';

@Component({
  selector: 'permissions',
  templateUrl: 'permissions.component.html',
})
export class PermissionsComponent extends Section {
  @Input() form: FormGroup;

  private configs = {
    'fjps': {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  private options = {
    'contract-opportunities': [
      { label: 'Read',           name: 'co-read',           value: 'co-read' },
      { label: 'Read Sensitive', name: 'co-read-sensitive', value: 'co-read-sensitive' },
      { label: 'Write',          name: 'co-write',          value: 'co-write' },
    ],

    'contract-data': [
      { label: 'Read',     name: 'cd-read',     value: 'cd-read' },
      { label: 'Write',    name: 'cd-write',    value: 'cd-write' },
      { label: 'DoD Data', name: 'cd-dod-data', value: 'cd-dod-data' },
    ],

    'entity-information': [
      { label: 'Read Public',    name: 'ei-read-public',    value: 'ei-read-public' },
      { label: 'Read FOUO',      name: 'ei-read-fouo',      value: 'ei-read-fouo' },
      { label: 'Read Sensitive', name: 'ei-read-sensitive', value: 'ei-read-sensitive' },
    ],

    'fjps': [
      { label: 'Low',    value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High',   value: 'high' },
    ]
  };

  private keys = ['contract-opportunities', 'contract-data', 'entity-information'];
  private permissions = {
    'contract-opportunities': [],
    'contract-data': [],
    'entity-information': [],
  };

  constructor() {
    super();
    this.labels = {
      permissions: {
        label: 'Permissions',
        hint: 'What permissions do you need?',
      },

      fjps: {
        label: 'Overall FJPS 1QQ Categorization',
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

  updatePermissions(selected) {
    console.log(selected);
  }
}
