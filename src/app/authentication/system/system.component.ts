import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IAMService } from 'api-kit';

@Component({
  templateUrl: './system.component.html',
  providers: [
    IAMService
  ]
})
export class SystemComponent {
  private store = {
    title: 'System Account',
    nav: [
      { text: 'Profile',        routerLink: 'profile', routerLinkActive: 'usa-current', children: [
        { text: 'System Information',       routerLink: '#system-information',       anchor: true },
        { text: 'Organization Information', routerLink: '#organization-information', anchor: true },
        { text: 'Point of Contact',         routerLink: '#point-of-contact',         anchor: true },
        { text: 'Deactivate Account',       routerLink: '#deactivate-account',       anchor: true },
      ] },
      { text: 'Reset Password', routerLink: 'password',   routerLinkActive: 'usa-current' },
      { text: 'My Access',      routerLink: false,        routerLinkActive: 'usa-current' },
      { text: 'Migrations',     routerLink: 'migrations', routerLinkActive: 'usa-current' }
    ]
  };

  private states = {
    isSystemAccount: false,
    route: ''
  };

  activeRouteClass = '';

  constructor(private router: Router, private zone: NgZone, private api: IAMService) {
    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationEnd') {
        this.checkRoute();
        this.checkAccess();
      }
    });
  }

  ngOnInit() {
    this.checkRoute();
    this.checkAccess();
  }

  checkRoute() {
    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');
    this.setActiveRoute();
  }

  checkAccess() {
    this.api.iam.system.account.get((accounts) => {
      this.states.isSystemAccount = (accounts.length > 0);
      this.setAccess();
    }, () => {
      this.setAccess();
    });
  }

  setAccess() {
    if(!this.states.isSystemAccount) {
      this.store.nav[this.store.nav.length - 1]['hidden'] = true;
    }
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }
};
