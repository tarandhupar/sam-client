import { Component, Output, EventEmitter } from '@angular/core';

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
    {linkTitle:"Home", linkClass:"fa-home"},
    {linkTitle:"Reports", linkClass:"fa-area-chart"},
    {linkTitle:"Workspace", linkClass:"fa-table"},
    {linkTitle:"Help", linkClass:"fa-info-circle"},
    {linkTitle:"Hierarchy", linkClass:"fa-sitemap"},
    {linkTitle:"Users", linkClass:"fa-user-plus"},
  ];

  constructor() { }

  onMenuClick(){
    setTimeout(()=>{
      this.showDropdown = !this.showDropdown;
      this.onDropdownToggle.emit(this.showDropdown);
      this.startCheckOutsideClick = this.showDropdown;

    });

  }

  dropdownItemClick(index){
    this.closeDropdown();

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
}
