import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../app/globals.ts';


@Component({
  selector: 'SamHeaderLinks',
  templateUrl: 'header-links.template.html',
  styleUrls: [ 'header-links.style.css' ]
})
export class SamHeaderLinksComponent{


  @Output()
  onDropdownToggle:EventEmitter<any> = new EventEmitter<any>();

  private startCheckOutsideClick:boolean = false;
  private showDropdown:boolean = false;
  private dropdownData:any = [
    {linkTitle:"Home", linkClass:"fa-home", linkUrl:"/"},
    {linkTitle:"Reports", linkClass:"fa-area-chart", linkUrl:"/"},
    {linkTitle:"Workspace", linkClass:"fa-table", linkUrl:"/"},
    {linkTitle:"Help", linkClass:"fa-info-circle", linkUrl:"/help/overview"},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap", linkUrl:"/"},
    {linkTitle:"Users", linkClass:"fa-user-plus", linkUrl:"/"},
  ];

  constructor(private _router:Router) { }

  onMenuClick(){
    setTimeout(()=>{
      this.showDropdown = !this.showDropdown;
      this.onDropdownToggle.emit(this.showDropdown);
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
  get showOptional() {
    return globals.showOptional;
  }
}
