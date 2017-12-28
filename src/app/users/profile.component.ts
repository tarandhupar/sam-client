import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd , Router } from '@angular/router';
import { IAMService } from 'api-kit';
import { ToggleService } from 'api-kit/toggle/toggle.service';
import { ProfilePageService } from './profile-page.service';

import { MenuItem } from 'sam-ui-elements/src/ui-kit/components/sidenav/interfaces';
import { find, get, isObject } from 'lodash';

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

    nav: <MenuItem> {
      label: ' ',
      children: [
        { label: 'Account Details', route: 'details',       iconClass: '' },
        { label: 'Reset Password',  route: 'password',      iconClass: '' },
        { label: 'My Roles',        route: 'access' ,       iconClass: '' },
        { label: 'Role Migrations', route: 'migrations',    iconClass: '' },
        { label: 'Following',       route: 'subscriptions', iconClass: '' },
      ],
    },
  };

  private states = {
    route: '',
    active: 'Account Details',
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
          for(i = this.store.nav.children.length - 1; i >= 0; i--) {
            if(this.store.nav[i].text == "Following") {
              this.store.nav.children.splice(i, 1); break;
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
        data['breadcrumbs'][0]['breadcrumb'] = `${user.fullname}`;
      }
    }

    if(data['title']) {
      this.store.title = data['title'];
    }

    if(data['breadcrumbs'] === false) {
      this.breadcrumbs = [];
    } else {
      switch(this.routeName) {
        case 'role-management':
          this.breadcrumbs = [
            { breadcrumb: 'Workspace', url: '/workspace' },
            { breadcrumb: 'Roles Directory', url: '/role-management/roles-directory' },
          ];

          this.breadcrumbs = this.breadcrumbs.concat(data['breadcrumbs']);

          break;

        case 'profile':
          this.breadcrumbs =  this.store.breadcrumbs.concat(data['breadcrumbs']);
          break;
      }
    }

    data['alert'] = data['alert'] || {};

    if(isObject(data['alert'])) {
      this.store.alert.title = data['alert'].title || '';
      this.store.alert.content = data['alert'].content || '';
    }
  }

  get routeName(): string {
    let parts = this.router.url.split('/'),
        name = parts.length > 1 ? parts[1] : parts[0];
    return name;
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

    if(this.states.sidenav) {
      this.states.active = find(this.store.nav.children, { route: this.states.route.replace(/\/[a-z]+\//, '') }).label;
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

  onNavigate(route) {
    this.router.navigate([route], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }
};
