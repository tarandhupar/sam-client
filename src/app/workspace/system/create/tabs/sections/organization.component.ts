import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AgencyPickerComponent } from 'app-components';

import { Section } from './section';
import { User } from 'api-kit/iam/interfaces'

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
  @ViewChild(AgencyPickerComponent) agencyPicker;

  @Input('group') form: FormGroup;
  @Input() user: User;

  private configs = {
    systemAdmins: getConfig('systemAdmins'),
    systemManagers: getConfig('systemManagers'),
  }

  private _submitted:boolean = false;
  private subscriptions = {};
  private organization = new FormControl('', [Validators.required]);
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
    this.updateSelected();
  }

  setHierarchy(hierarchy: Array<{ label: string, value: number }>) {
    let organization;

    if(hierarchy) {
      this.form.get('departmentOrgId').setValue(this.getOrgKey(hierarchy[0]));
      this.form.get('agencyOrgId').setValue(this.getOrgKey(hierarchy[1]));
      this.form.get('officeOrgId').setValue(this.getOrgKey(hierarchy[2]));

      this.updateSelected();
    }
  }

  getOrgKey(org: { label: string, value: number }) {
    let key = 0;

    if(org) {
      key = org.value || 0;
    }

    return key;
  }

  get submitted(): boolean {
    return this._submitted;
  }

  @Input()
  set submitted(submitted: boolean) {
    this._submitted = submitted;
    this.updateSelection();
  };

  updateSelection() {
    if(this.submitted && this.agencyPicker) {
      this.agencyPicker.setOrganizationFromBrowse();
    }
  }

  errors(key: string = ''): string {
    let error = '';

    if(this.submitted && key == 'organization') {
      error = this.organization.invalid ? 'At least an agency must be selected' : '';
    } else {
      error = this.getError(this.form, key, this.submitted);
    }

    return error;
  }

  updateSelected() {
    let form = this.form.value,
        organization = form.officeOrgId || form.agencyOrgId || form.departmentOrgId;

    this.selected = organization ? [organization] : [];
  }
}
