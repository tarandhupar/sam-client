import { Component, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';

import { IAMService } from 'api-kit';

@Component({
  selector: 'SamHeaderLinks',
  templateUrl: 'header-links.component.html',
  providers: [IAMService]
})
export class SamHeaderLinksComponent {
  private startCheckOutsideClick: boolean = false;
  private user = null;
  private states = {
    isSignedIn: false
  };

  @Output() onDropdownToggle:EventEmitter<any> = new EventEmitter<any>();

  showDropdown:boolean = false;
  dropdownData:any = [
    {linkTitle:"Home", linkClass:"fa-home", linkUrl:"/", pageInProgress:false},
    {linkTitle:"Reports", linkClass:"fa-area-chart", linkUrl:"/reports/overview", pageInProgress:true},
    {linkTitle:"Workspace", linkClass:"fa-table", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Help", linkClass:"fa-info-circle", linkUrl:"/help/overview", pageInProgress:false},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Users", linkClass:"fa-user-plus", linkUrl:"/", pageInProgress:true},
  ];

  constructor(private _router:Router, private zone: NgZone, private api: IAMService) {
    this._router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationStart') {
        this.checkSession();
      }
    });
  }

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          this.states.isSignedIn = true;
          this.user = user;
        });
      });
    });
  }

  onMenuClick(){
    this.showDropdown = !this.showDropdown;
    this.onDropdownToggle.emit(this.showDropdown);
    setTimeout(()=>{
      this.startCheckOutsideClick = this.showDropdown;
    });
  }

  dropdownItemClick(item){
    this.closeDropdown();
    this._router.navigateByUrl(item.linkUrl);
  }

  closeDropdown(){
    this.showDropdown = false;
    this.onDropdownToggle.emit(this.showDropdown);
    setTimeout(()=>{
      this.startCheckOutsideClick = this.showDropdown;
    });
  }

  onClickOutside(){
    if(this.startCheckOutsideClick){
      this.startCheckOutsideClick = false;
      this.closeDropdown();
    }
  }

  itemToggle(item){
    if(!globals.showOptional){
      return !item.pageInProgress;
    }
    return true;
  }
}
