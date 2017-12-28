import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { IAMService } from 'api-kit';
import { find, isUndefined } from 'lodash';

import { MenuItem } from 'sam-ui-elements/src/ui-kit/components/sidenav/interfaces';

@Component({
  templateUrl: './fsd.component.html',
})
export class FSDComponent {
  private store = {
    id: null,
    section: 'FSD Workspace',
    title: '',
    heading: '',
    caption: '',
    subscriptions: {},
    breadcrumbs: [
      { breadcrumb: 'Workspace', url: '/workspace' },
    ],

    nav: <MenuItem> {
      label: ' ',
      children: [
        { label: 'Account Info',  route: 'user/:id',        iconClass: '' },
        { label: 'Account Roles', route: 'user/:id/access', iconClass: '' },
      ],
    },
  };

  private breadcrumbs = this.store.breadcrumbs;
  private states = {
    route: '',
    active: 'Account Info',
    sidebar: true
  };

  private activeRouteClass = '';

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {
    this.router.events
     .filter(event => event instanceof NavigationEnd)
     .subscribe(event => {
       this.checkRoute();
     });
  }

  ngOnInit() {
    this.checkRoute();
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.store.subscriptions).map(key => {
      if(this.store.subscriptions[key]) {
        this.store.subscriptions[key].unsubscribe();
      }
    });
  }

  checkRoute() {
    this.states.sidebar = this.router.url.match(/\/fsd\/users/) ? false : true;
    this.states.route = this.router.url
      .replace(/#.+/, '')
      .replace(/\?.+/, '');

    this.store.subscriptions['params'] = this.route.children[0].params
      .filter(params => params.id)
      .subscribe(params => {
        this.store.id = params.id;
        this.api.iam.fsd.user(params['id'], user => {
          this.store.heading = user.fullName;
          this.store.caption = user.email;
        });
      });

    this.store.subscriptions['data'] = this.route.children[0].data
      .filter(data => (data.breadcrumbs || data.title))
      .subscribe(data => {
        this.breadcrumbs = this.store.breadcrumbs.concat(data['breadcrumbs']);
        this.store.title = data['title'] || '';
      });

    this.setActiveRoute();
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');

    if(className.indexOf('fsd-user-') > -1) {
      className = '-fsd-user';
    }

    if(this.states.sidebar) {
      this.states.active = find(this.store.nav.children, {
        route: this.states.route
          .replace('/workspace/fsd/', '')
          .replace(/\/([A-Za-z0-9_.-]+)(\/access)?$/, '/:id$2')
      }).label;
    }

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }

  onNavigate(route) {
    let routerLink = route
      .replace(/:id/, this.store.id)
      .split('/');

    this.router.navigate(routerLink, {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }
};
