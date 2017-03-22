import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector : 'role-sidenav',
  templateUrl : "./role-sidenav.template.html"
})
export class RoleSideNav implements OnInit{
    path: 'role'|'object' = 'role';
    constructor(private router: Router){ }

    ngOnInit() {
      this.determinePath();
    }

    determinePath(){
      let match = this.router.url.match('roles');
      console.log(this.router.url.match('roles'));
      if(match && match.length) {
        console.log("Here");
        this.path = 'role';
      }
    }

}
