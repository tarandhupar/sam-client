import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FALOpSharedService } from './assistance-listing-operations.service';
import * as Cookies from 'js-cookie';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ FALOpSharedService ]
})

export class ProgramPageOperations implements OnInit {

  // On load select first item on sidenav component
  selectedPage: number = 0;
  pageFragment: string;
  sidenavModel = {};

  constructor(private sharedService: FALOpSharedService,
              private router: Router) {

    this.sidenavModel = sharedService.getSideNavModel();

  }

  ngOnInit(){
    this.sharedService.setSideNavFocus();

    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.sharedService.setSideNavFocus();
      }else {
        this.router.navigate(['accessrestricted']);
      }
    }
    else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }

  }

  selectedItem(item){
    this.selectedPage = this.sharedService.selectedItem(item);
  }

  sidenavPathEvtHandler(data){

    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;
    if (this.pageFragment == data.substring(1)) {
      document.getElementById(this.pageFragment).scrollIntoView();
    }
    else if(data.charAt(0)=="#"){
      this.router.navigate([], { fragment: data.substring(1) });
    } else {
      this.router.navigate([data]);
    }
  }
}
