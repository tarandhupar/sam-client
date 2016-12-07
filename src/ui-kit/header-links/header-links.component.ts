import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';


@Component({
  selector: 'SamHeaderLinks',
  templateUrl: 'header-links.template.html',
  //styleUrls: [ 'header-links.style.css' ]
})
export class SamHeaderLinksComponent{


  @Output()
  onDropdownToggle:EventEmitter<any> = new EventEmitter<any>();

  private startCheckOutsideClick:boolean = false;
  showDropdown:boolean = false;
  dropdownData:any = [
    {linkTitle:"Home", linkClass:"fa-home", linkUrl:"/", pageInProgress:false},
    {linkTitle:"Reports", linkClass:"fa-area-chart", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Workspace", linkClass:"fa-table", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Help", linkClass:"fa-info-circle", linkUrl:"/help/overview", pageInProgress:false},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap", linkUrl:"/", pageInProgress:true},
    {linkTitle:"Users", linkClass:"fa-user-plus", linkUrl:"/", pageInProgress:true},
  ];

  constructor(private _router:Router) { }

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
