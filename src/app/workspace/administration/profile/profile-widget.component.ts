import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { IAMService, ToggleService } from 'api-kit';

import { User } from 'api-kit/iam/interfaces';
import { OptionsType } from 'sam-ui-elements/src/ui-kit/types'

@Component({
  selector: 'profile-widget',
  templateUrl: './profile-widget.component.html'
})
export class ProfileWidgetComponent implements OnChanges {
  @Input() user: User;

  private store = {
    roles: <OptionsType[]>[
      {
        label: 'Grants Only',
        name: 'roles-grants',
        value: 'grants-only',
      },
      {
        label: 'Intergovernmental Transactions',
        name: 'roles-transactions',
        value: 'intergovernmental-transactions',
      },
      {
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
    subscriptions: true,
  };

  constructor(private router: Router, private api: IAMService, private toggleService: ToggleService) {}

  ngOnInit() {
    if(!this.user) {
      this.api.iam.checkSession(user => {
        this.user = user;
        this.initRoles();
      });
    }

    this.toggleService.getToggleStatus('enablemanagesubscription','/wl').subscribe(isEnabled => {
      this.states.subscriptions = isEnabled;
    });
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
  }

  onChangeRole($event) {
    console.log($event);
  }
}
