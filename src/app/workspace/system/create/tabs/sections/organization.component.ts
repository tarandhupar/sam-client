import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  @Input('group') form: FormGroup;

  private configs = {
    systemAdmins: getConfig('systemAdmins'),
    systemManagers: getConfig('systemManagers'),
  }

  private subscriptions = {};
  private organization = new FormControl('');
  private selected = [];

  constructor(private builder: FormBuilder) {
    super();
    this.labels = {
      organization: {
        label: 'Organization',
        hint: 'Select the federal department, independent agency; sub-tier, or office responsible for managing this account',
      },

      systemAdmins: {
        label: 'System Administrators',
        hint: 'Identify one or two owners of this system account.',
      },

      systemManagers: {
        label: 'System Managers',
        hint: 'Identify at least 1 and not more than 3 managers for this system account.',
      }
    };
  }

  ngOnInit() {
    this.organization.valueChanges.subscribe(organization => {
      const orgKeys = (organization.fullParentPath || '').split('.');

      if(orgKeys[0])
        this.form.get('departmentOrgId').setValue(orgKeys[0]);
      if(orgKeys[1])
        this.form.get('agencyOrgId').setValue(orgKeys[1]);
      if(orgKeys[2])
        this.form.get('officeOrgId').setValue(orgKeys[2]);

      this.updateSelected();
    });

    this.updateSelected();
  }

  updateSelected() {
    let form = this.form.value,
        organization = form.officeOrgId || form.agencyOrgId || form.departmentOrgId;

    this.selected = organization ? [organization] : [];
  }
}
