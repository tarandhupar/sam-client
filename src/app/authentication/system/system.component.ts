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
      ] },
      { text: 'Reset Password', routerLink: 'password',   routerLinkActive: 'usa-current' }
    ]
  };

  private states = {
    route: ''
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
    /*
    this.api.iam.checkSession((user) => {
      this.zone.run(() => {
      });
    });
    */
    this.store.nav.push(

    );

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
