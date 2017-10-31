import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { IAMService } from 'api-kit';

@Component({
  templateUrl: './fsd.component.html',
  providers: [
    IAMService
  ]
})
export class FSDComponent {
  private store = {
    title: 'title',
    subtitle: 'subtitle',
    subscriptions: {},
    breadcrumbs: [
      { breadcrumb: 'Workspace', url: '/workspace' },
    ],

    nav: [
      { text: 'Account Info', routerLink: ['user'], routerLinkActive: 'usa-current', children: [
        { text: 'Identifying Information',  routerLink: '#identifying-information',  anchor: true },
        { text: 'Organization Information', routerLink: '#organization-information', anchor: true },
        { text: 'Security Questions',       routerLink: '#security-questions',       anchor: true },
        { text: 'Deactivate Account',       routerLink: '#deactivate-account',       anchor: true },
        { text: 'Password Reset Email',     routerLink: '#password-reset',           anchor: true },
      ] }
    ]
  };

  private breadcrumbs = this.store.breadcrumbs;
  private states = {
    route: '',
    sidebar: true
  };

  private activeRouteClass = '';

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {
    this.router.events
     .filter(event => event instanceof NavigationEnd)
     .subscribe(event => {
       this.checkRoute();
       this.checkAccess();
     });
  }

  ngOnInit() {
    this.store.subscriptions['params'] = this.route.children[0].params.subscribe(params => {
      if(params['id']) {
        this.api.iam.fsd.user(params['id'], (user) => {
          this.store.subtitle = user._id;
          this.store.title = user.fullName;
        });
      }
    });

    this.store.subscriptions['data'] = this.route.children[0].data.subscribe(data => {
      this.breadcrumbs = this.store.breadcrumbs.concat(data['breadcrumbs']);
    });

    this.checkRoute();
    this.checkAccess();
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.store.subscriptions).map(key => {
      if(this.store.subscriptions[key]) {
        this.store.subscriptions[key].unsubscribe();
      }
    });
  }

  checkAccess() {
    this.store['observer'] = this.route.firstChild.params.subscribe(params => {
      if(params['id']) {
        this.store.nav = this.store.nav.map((nav, intNav) => {
          nav.routerLink = [nav.routerLink[0], params['id']];
          return nav;
        });
      }
    });
  }

  checkRoute() {
    if(this.router.url.match(/\/fsd\/users/)) {
      this.states.sidebar = false;
    }

    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');
    this.setActiveRoute();
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');

    if(className.indexOf('fsd-user-') > -1) {
      className = '-fsd-user';
    }

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }
};
