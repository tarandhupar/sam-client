import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { FHService, IAMService } from 'api-kit';

import { User } from '../../../authentication/user.interface';
import { OptionsType } from 'sam-ui-kit/types'

@Component({
  selector: 'profile-widget',
  templateUrl: './profile-widget.component.html'
})
export class ProfileWidgetComponent implements OnChanges {
  @Input() user: User;

  private api = {
    fh: null,
    iam: null,
  };

  private store = {
    primary: '',
    secondary: 'Sub-tier Agency',
    roles: [
      <OptionsType>{
        label: 'Grants Only',
        name: 'roles-grants',
        value: 'grants-only',
      },
      <OptionsType>{
        label: 'Intergovernmental Transactions',
        name: 'roles-transactions',
        value: 'intergovernmental-transactions',
      },
      <OptionsType>{
        label: 'All Awards',
        name: 'roles-awards',
        value: 'all-awards',
      },
    ]
  };

  private states = {
    public: false,
    federal: false,
    entity: true,
  };

  constructor(private router: Router, private _fh: FHService, private _iam: IAMService) {
    this.api.iam = _iam.iam;
    this.api.fh = _fh;
  }

  ngOnInit() {
    if(!this.user) {
      this.api.iam.checkSession(user => {
        this.user = user;
        this.initRoles();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['user']) {
      this.initRoles();
    }
  }

  initRoles() {
    this.states.public = !(this.user.gov || this.user.entity);
    this.states.federal = this.user.gov;
    this.states.entity = this.user.entity;

    // Remove After Demo
    if(this.user.email.match(/@(bah|governmentcio).com/g)) {
      this.states.public = false;
      this.states.federal = false;
      this.states.entity = true;
      this.store.primary = 'Booz Allen Hamilton';
    }

    if(this.states.federal) {
      const orgID = (this.user.agencyID || this.user.departmentID).toString();

      if(orgID.length) {
        this.api.fh
         .getOrganizationById(orgID)
         .subscribe(data => {
           const organization = data['_embedded'][0]['org'];
           this.store.primary = (organization.l2Name || organization.l1Name || '');
         });
      }
    }
  }

  onChangeRole($event) {
    console.log($event);
  }
}
