import {Injectable} from '@angular/core';
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import { ActivatedRoute } from '@angular/router';
import * as Cookies from 'js-cookie';

@Injectable()

export class FALOpSharedService{

  baseURL : string;
  programId: string;
  sidenavModel = {};
  cookieValue: string;

  constructor(private sidenavService: SidenavService, private route: ActivatedRoute){

    if(!this.cookieValue)
      this.cookieValue = Cookies.get('iPlanetDirectoryPro');
  }

  getSideNavModel(){

    if(this.route.snapshot.params['id']){
      this.programId = this.route.snapshot.params['id'];
      this.baseURL = "programs/" + this.route.snapshot.params['id'] + "/edit";
    }
    else {
      this.baseURL = "programs/add";
    }

    this.sidenavModel = {
      label: "Assistance Listings",
        children: [
      {
        label: "Header Information",
        route: this.baseURL + '/header-information',
        path: 'header-information'
      },
      {
        label: "Overview",
        route: this.baseURL + '/overview',
        path: 'overview'
      },
      {
        label: "Financial Information",
        route: this.baseURL + '/financial-information',
        path: 'financial-information',
        children:[
          {
            label: "Obligations",
            route: '/obligations',
            path: 'obligations'
          },
          {
            label: "Other Financial Info",
            route: '/other-financial-info',
            path: 'other-financial-info'
          }
        ]
      },
      {
        label : "Contact Information",
        route: this.baseURL + "/contact-information",
        path: "contact-information"
      }
    ]
    };

    return this.sidenavModel;
  }

  setSideNavFocus(){

    let grandChildPath : string;
    let childPath = this.route.snapshot.children[0].url[0].path;

    if(this.route.snapshot.children[0].url.length > 1){
      grandChildPath = this.route.snapshot.children[0].url[1].path;
    }

    for(let child of this.sidenavModel['children']) {
      if(child.path == childPath) {
        this.sidenavService.updateData(0, this.sidenavModel['children'].indexOf(child));
        if(child['children']) {
          for (let grandChild of child['children']) {
            if (grandChild.path == grandChildPath) {
              this.sidenavService.updateData(1, child['children'].indexOf(grandChild));
            }
          }//end of grandchild for
        }
      }
    }//end of child for

  }

  selectedItem(item){
    return this.sidenavService.getData()[0];
  }

}
