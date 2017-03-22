import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
  mode: 'edit'|'new' = 'new';

  constructor(private router: Router) { }

  ngOnInit() {
    this.determineMode();
  }

  determineMode() {
    if(/edit\/?^/.test(this.router.url)) {
      this.mode = 'edit';
    }
  }
}
