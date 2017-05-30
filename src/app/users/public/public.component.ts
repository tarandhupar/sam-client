import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Cookie } from "ng2-cookies";

@Component({
  templateUrl: 'public.component.html'
})
export class UserViewComponent implements OnInit {

  private userName: string;
  private isLevel0: boolean;
  private isLevel1: boolean;
  private isAdmin: boolean;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userName = this.route.snapshot.params['id'];
    this.isLevel0 = Cookie.get('adminLevel') === '0';
    this.isLevel1 = Cookie.get('adminLevel') === '1';
    this.isAdmin = this.isLevel0 || this.isLevel1;
  }
}
