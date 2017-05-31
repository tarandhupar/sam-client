import { Component, Input, HostListener, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { IAMService } from "api-kit";
import { UserAccessService } from "api-kit/access/access.service";
import { UserAccessModel } from "../../../app/users/access.model";

@Component({
  selector: 'workspace-administration',
  templateUrl: 'administration.template.html'
})
export class AdministrationComponent {

  helpDetailType:any = ["", ""];
  configObj:any = [
    {profile: {isExpand: false}, aacRequest: {isExpand: false}},
    {fh: {isExpand: false}, rm: {isExpand: false}},
    {alerts: {isExpand: false}, analytics: {isExpand: false}},
  ];

  user = null;

  states = {
    isSignedIn: false,
    menu: false,
    isCreate: false,
    isEdit: false
  };

  @Input()
  toggleControl:any;

  constructor(private _router:Router,
              private route:ActivatedRoute,
              private zone:NgZone,
              private api:IAMService,
              private role:UserAccessService) {
  }

  ngOnInit(){
    this.checkSession();
  }

  toggleHelpDetail(type, isExpand, index) {
    this.helpDetailType[index] = type;
    this.configObj[index][type].isExpand = isExpand;
    if (isExpand) {
      this.configObj.forEach(e => {
        Object.keys(e).forEach(item => {
          if (item !== type) e[item].isExpand = false;
        });
      })
    }
  }

  isDetailExpanded(index) {
    let expanded = false;
    Object.keys(this.configObj[index]).forEach(e => {
      if (this.configObj[index][e].isExpand) expanded = true;
    });
    return expanded;
  }

  onAddNewAlert() {
    let navigationExtras:NavigationExtras = {
      queryParams: {mode: 'create'},
    };
    this._router.navigate(["/alerts"], navigationExtras);
  }

  checkSession() {
    //Get the sign in info
    this.api.iam.checkSession((user) => {
      this.zone.run(() => {
        this.states.isSignedIn = true;
        this.user = user;
      });
    });
  }
}
