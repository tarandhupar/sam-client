import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: 'public.component.html'
})
export class UserViewComponent implements OnInit {

  private userName: string;
  private hideNav: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userName = this.route.snapshot.params['id'];
    if (/grant-access.*role-workspace/.test(this.router.url)) {
      this.hideNav = true;
    }
  }
}
