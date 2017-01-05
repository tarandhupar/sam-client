import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log(this.router);
  }
};
