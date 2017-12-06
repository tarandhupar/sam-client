import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd , Router } from '@angular/router';
import { IAMService } from 'api-kit';
import { ToggleService } from 'api-kit/toggle/toggle.service';
import { ProfilePageService } from './profile-page.service';

import { get, isObject } from 'lodash';

@Component({
  templateUrl: './profile.component.html',
  providers: [
    ProfilePageService,
  ]
})
export class ProfileComponent {
  private subscriptions = {};
  private store = {
    title: 'Profile',
    breadcrumbs: [
      { breadcrumb: 'Profile', url: '/profile' },
    ],

    alert: {
      type: 'info',
      title: '',
      content: '',
    },

    nav: [
      { text: 'Personal Details',      routerLink: ['details'],       routerLinkActive: 'usa-current' },
      { text: 'Reset Password',        routerLink: ['password'],      routerLinkActive: 'usa-current' },
      { text: 'My Roles',              routerLink: ['access'],        routerLinkActive: 'usa-current' },
      { text: 'Role Migrations',       routerLink: ['migrations'],    routerLinkActive: 'usa-current' },
      { text: 'Manage Subscriptions',  routerLink: ['subscriptions'], routerLinkActive: 'usa-current' },
    ],
  };

  private states = {
    route: '',
    sidenav: false,
    fsd: false,
  };

  private breadcrumbs = [];

  public activeRouteClass = '';

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService, private toggleService: ToggleService) {}

  ngOnInit() {
    this.subscriptions['toggleService'] = this.toggleService
      .getToggleStatus('enablemanagesubscription','/wl')
      .subscribe(isEnabled => {
        console.log(`profile page enablemanagesubscription >>>>>${isEnabled}`);
        if(!isEnabled) {
          let i;
          for(i = this.store.nav.length - 1; i >= 0; i--) {
            if(this.store.nav[i].text == "Manage Subscriptions") {
              this.store.nav.splice(i, 1); break;
            }
          }
        }
       });

    this.subscriptions['navigation'] = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.verifyRouteData();
        this.checkRoute();
      });

    this.states.fsd = this.api.iam.user.isFSD();

    this.checkRoute();
    this.verifyRouteData();
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      if(this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    });
  }

  verifyRouteData() {
    const data = this.route.snapshot.firstChild.data;

    if(data['user']) {
      let user = {
        email: get(data['user'], 'user.email') || '',
        firstName: get(data['user'], 'user.firstName') || '',
        lastName: get(data['user'], 'user.lastName'),
        fullname: '',
      };

      user.fullname = (`${user.firstName} ${user.lastName}`).trim();
      user.fullname = user.fullname.length ? user.fullname : user.email;

      data['title'] = user.fullname;

      if(data['breadcrumbs'] && data['breadcrumbs'].length) {
        data['breadcrumbs'][0]['breadcrumb'] = `${user.fullname}'s Roles`;
      }
    }

    if(data['title']) {
      this.store.title = data['title'];
    }

    if(data['breadcrumbs'] === false) {
      this.breadcrumbs = [];
    } else {
      this.breadcrumbs = this.store.breadcrumbs.concat(data['breadcrumbs']);
    }

    data['alert'] = data['alert'] || {};

    if(isObject(data['alert'])) {
      this.store.alert.title = data['alert'].title || '';
      this.store.alert.content = data['alert'].content || '';
    }
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

    if(!this.states.route.match(/\/(role-management)/g)) {
      this.states.sidenav = true;
    }


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
