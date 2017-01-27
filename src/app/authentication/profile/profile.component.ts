import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private states = {
    route: ''
  };

  activeRouteClass = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationStart') {
        this.checkRoute();
      }
    });
  }

  ngOnInit() {
    this.checkRoute();
  }

  checkRoute() {
    this.states.route = this.router.url;
    this.setActiveRoute();
  }

  setActiveRoute() {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');

    this.activeRouteClass = (className.length ? 'usa' : '') + className;
  }
};
