import { Injectable } from '@angular/core';

@Injectable()
export class PageService {

  _sidebar: boolean;
  _wideSidebar: boolean;
  sidebarColumns: string
  mainContentColumns: string;

  set sidebar(value: boolean){
    this._sidebar = value;
    if(this._sidebar && !this.wideSidebar){
      this.sidebarColumns = "three wide column";
      this.mainContentColumns = "nine wide column";
    }else if(this._sidebar && this.wideSidebar){
      this.sidebarColumns = "four wide column";
      this.mainContentColumns = "eight wide column";
    }else{
      this.sidebarColumns = "";
      this.mainContentColumns = "twelve wide column";
    }
  }

  get sidebar(){
    return this._sidebar;
  }

  set wideSidebar(value: boolean){
    this._wideSidebar = value;
    if(this.wideSidebar && this.sidebar){
      this.sidebarColumns = "four wide column";
      this.mainContentColumns = "eight wide column";
    }
  }

  get wideSidebar(){
    return this._wideSidebar;
  }


}
