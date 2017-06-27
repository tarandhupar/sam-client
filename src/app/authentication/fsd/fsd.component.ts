import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    nav: [
      { text: 'Account Info', routerLink: 'user', routerLinkActive: 'usa-current', children: [
        { text: 'Identifying Information',  routerLink: '#identifying-information',  anchor: true },
        { text: 'Organization Information', routerLink: '#organization-information', anchor: true },
        { text: 'Security Questions',       routerLink: '#security-questions',       anchor: true },
        { text: 'Deactivate Account',       routerLink: '#deactivate-account',       anchor: true },
        { text: 'Password Reset Email',     routerLink: '#password-reset',           anchor: true },
      ] }
    ]
  };

  private states = {
    route: '',
    sidebar: true
  };

  private activeRouteClass = '';

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {
    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationEnd') {
        this.checkRoute();
      }
    });

    this.store['observer'] = this.route.children[0].params.subscribe(params => {
      this.api.iam.fsd.user(params['id'], (user) => {
        this.store.subtitle = user._id;
        this.store.title = user.fullName;
      });
    });
  }

  ngOnInit() {
    this.checkRoute();
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
