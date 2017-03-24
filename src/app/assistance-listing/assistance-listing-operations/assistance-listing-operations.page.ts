import {Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { globals } from '../../app/globals.ts';
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import { ProgramService } from 'api-kit';
import * as Cookies from 'js-cookie';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ProgramService]
})

export class ProgramPageOperations implements OnInit {

  // On load select first item on sidenav component
  selectedPage: number = 0;
  pageFragment: string;
  sidenavModel = {};
  baseURL: string;

  constructor(private sidenavService: SidenavService, private router: Router, private route: ActivatedRoute) {

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
        if (this.pageFragment) {
          const element = document.getElementById(tree.fragment);
          if (element) { element.scrollIntoView(); }
        }
      }
    });

    if(this.route.snapshot.params['id']){
        this.baseURL = "programs/" + this.route.snapshot.params['id'] + "/edit";
    }
    else {
      this.baseURL = "programs/add";
    }

    this.sidenavModel = {
      label: "Assistance Listings",
      children: [
        {
          label : "Header Information",
          route: this.baseURL + '/header-information',
          path: 'header-information'
        },
        {
          label : "Overview",
          route: this.baseURL + '/overview',
          path: 'overview'
        },
        {
          label: "Financial Information",
          route: this.baseURL + '/financial-information',
          path: 'financial-information',
          children:[
            {
              label : "Obligations",
              route: this.baseURL + '/financial-information/obligations',
              path: 'obligations'
            },
            {
              label : "Other Financial Info",
              route: this.baseURL + '/financial-information/other-financial-info',
              path: 'other-financial-info'
            }
          ]
        }
      ]
    };

  }

  ngOnInit(){
    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        let path = this.route.snapshot.firstChild.url[0].path;

        for(let child of this.sidenavModel['children']) {
          if(child.path == path) {
            this.sidenavService.updateData(this.selectedPage, this.sidenavModel['children'].indexOf(child));
          }
        }

      }else {
        this.router.navigate(['accessrestricted']);
      }
    }
    else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }

  }

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
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
