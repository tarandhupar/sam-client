import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: 'role-details.page.html'
})
export class RoleDetailsPage {
  mode: 'edit'|'create' = 'create';

  constructor(private router: Router) { }

  ngOnInit() {
    this.determineMode();
  }

  determineMode() {
    let match = this.router.url.match('edit');
    if(match && match.length) {
      this.mode = 'edit';
    }
  }
}
