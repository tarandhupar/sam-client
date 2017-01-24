import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private states = {
    route: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((location) => {
      this.states.route = location.url;
    });

    this.states.route = this.router.url;
  }

  get activeRouteClass():String {
    let className = this.states.route
      .replace(/\//g, '-')
      .replace(/\?.+/g, '');
    return (className.length ? 'usa' : '') + className;
  }
};
