import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
      { text: 'Profile',        routerLink: ['profile'],  routerLinkActive: 'usa-current', children: [
        { text: 'System Information',       routerLink: '#system-information',       anchor: true },
        { text: 'Organization Information', routerLink: '#organization-information', anchor: true },
        { text: 'Point of Contact',         routerLink: '#point-of-contact',         anchor: true },
        { text: 'Deactivate Account',       routerLink: '#deactivate-account',       anchor: true, hidden: true },
      ] },
      { text: 'Reset Password', routerLink: ['password'], routerLinkActive: 'usa-current', hidden: true },
      // { text: 'My Access',      routerLink: false,        routerLinkActive: 'usa-current' },
      // { text: 'Migrations',     routerLink: 'migrations', routerLinkActive: 'usa-current' }
    ],
  };

  private states = {
    isProfile: false,
    nav: true,
    route: '',
  };

  activeRouteClass = '';

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {
    this.router.events.subscribe((event) => {
      switch(event.constructor.name) {
        case 'NavigationEnd':
          this.checkRoute();
          this.checkAccess();

          break;
      }
    });
  }


  ngOnInit() {
    this.checkRoute();
    this.checkAccess();
  }

  ngOnDestroy() {
    this.store['observer'].unsubscribe();
  }

  checkRoute() {
    this.states.nav = this.router.url.match(/workspace\/system([^\/]|$)/) ? false : true;
    this.states.isProfile = this.router.url.match(/workspace\/system\/profile/) ? true : false;
    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');
    this.setActiveRoute();
  }

  checkAccess() {
    this.store['observer'] = this.route.firstChild.params.subscribe(params => {
      if(params['id']) {
        this.store.nav[0]['children'][3]['hidden'] = false;
        this.store.nav[1]['hidden'] = false;

        this.store.nav = this.store.nav.map((nav, intNav) => {
          nav.routerLink = [nav.routerLink[0], params['id']];
          return nav;
        });
      }
    });
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '')
      .replace(/(system-profile).+/, '$1');

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }
};
