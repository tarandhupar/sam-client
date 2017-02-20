import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: 'public.component.html'
})
export class UserViewComponent implements OnInit {

  private userName: string;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.userName = this.router.snapshot.params['id'];
  }
}
