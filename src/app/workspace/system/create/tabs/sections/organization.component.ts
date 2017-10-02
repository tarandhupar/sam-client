import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Section } from './section';

const getConfig = function(type: string) {
  let config = {
    keyProperty: 'mail',
    valueProperty: 'givenName',
    subheadProperty: 'mail'
  };

  if(type) {
    //TODO
  }

  return config;
}

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
})
export class OrganizationComponent extends Section {
  @Input() form: FormGroup;

  private configs = {
    administrators: getConfig('administrators'),
    managers: getConfig('managers'),
  }

  private administrators: FormArray;
  private managers: FormArray;

  constructor(private builder: FormBuilder) {
    super();
    this.labels = {
      department: {
        label: 'Organization',
        hint: 'Select the federal department, independent agency; sub-tier, or office responsible for managing this account',
      },

      administrators: {
        label: 'System Administrators',
        hint: 'Identify one or two owners of this system account.',
      },

      managers: {
        label: 'System Managers',
        hint: 'Identify at least 1 and not more than 3 managers for this system account.',
      }
    };
  }

  ngOnInit() {
    this.initPOC();
  }

  initPOC() {
    this.administrators = this.builder.array([]);
    this.managers = this.builder.array([]);
  }
}
