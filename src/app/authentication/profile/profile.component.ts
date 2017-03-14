import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private store = {
    title: 'My Profile',
    nav: [
      { text: 'Personal Details', routerLink: 'details',    routerLinkActive: 'usa-current' },
      { text: 'Reset Password',   routerLink: 'password',   routerLinkActive: 'usa-current' },
      { text: 'My Access',        routerLink: false,        routerLinkActive: 'usa-current' },
      { text: 'Role Migrations',  routerLink: 'migrations', routerLinkActive: 'usa-current' }
    ]
  };

  private states = {
    route: ''
  };

  activeRouteClass = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationEnd') {
        this.checkRoute();
      }
    });
  }

  ngOnInit() {
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
