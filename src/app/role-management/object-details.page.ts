import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
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
