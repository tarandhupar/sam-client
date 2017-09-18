import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
      { text: 'Personal Details',      routerLink: ['details'],       routerLinkActive: 'usa-current' },
      { text: 'Reset Password',        routerLink: ['password'],      routerLinkActive: 'usa-current' },
      { text: 'My Roles',              routerLink: ['access'],        routerLinkActive: 'usa-current' },
      { text: 'Role Migrations',       routerLink: ['migrations'],    routerLinkActive: 'usa-current' },
      { text: 'Manage Subscriptions',  routerLink: ['/profile', 'subscriptions'], routerLinkActive: 'usa-current' }
    ],
  };

  private states = {
    route: '',
    fsd: false
  };

  activeRouteClass = '';

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    this.states.fsd = this.api.iam.user.isFSD();
    this.checkRoute();

    this.router.events
     .filter(event => event instanceof NavigationEnd)
     .subscribe(event => {
       this.checkRoute();
     });
  }

  checkRoute() {
    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');
    this.setActiveRoute();
  }

  setActiveRoute() {
    let classes = [],
        route = this.states.route
          .replace(/\//g, '-')
          .replace(/\?.+/g, '')
          .replace(/^-/, '')
          .split('-');

    if(route.length) {
      route.unshift('usa');

      classes.push(route.join('-'));

      if(route.length > 3) {
        classes.push(route.slice(0, 4).join('-'));
      }
    }

    this.activeRouteClass = classes.join(' ');
  }
};
