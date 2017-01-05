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
    this.states.route = this.router.url;
  }

  get activeRouteClass():String {
    let className = this.states.route.replace(/\//g, '-');
    return (className.length ? 'usa' : '') + className;
  }
};
