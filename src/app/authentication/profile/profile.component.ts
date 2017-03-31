import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IAMService } from 'api-kit';

@Component({
  templateUrl: './profile.component.html',
  providers: [
    IAMService
  ]
})
export class ProfileComponent {
  private store = {
    title: 'My Profile',
    nav: [
      { text: 'Personal Details', routerLink: 'details',    routerLinkActive: 'usa-current' },
      { text: 'Reset Password',   routerLink: 'password',   routerLinkActive: 'usa-current' },
      { text: 'My Access',        routerLink: false,        routerLinkActive: 'usa-current' },
      { text: 'Role Migrations',  routerLink: 'migrations', routerLinkActive: 'usa-current' }
    ],

    systemNav: [
      { text: 'System Account', routerLink: '/system', routerLinkActive: 'usa-current' }
    ]
  };

  private states = {
    route: '',
    system: false
  };

  activeRouteClass = '';

  constructor(private router: Router, private zone: NgZone, private api: IAMService) {
    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationEnd') {
        this.checkRoute();
      }
    });
  }

  ngOnInit() {
    this.api.iam.checkSession((user) => {
      this.zone.run(() => {
        if(user.systemAccount) {
          this.states.system = true;
        }
      });
    });

    this.checkRoute();
  }

  checkRoute() {
    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');
    this.setActiveRoute();
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }
};
