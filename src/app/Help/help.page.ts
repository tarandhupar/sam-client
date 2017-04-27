import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { globals } from '../../app/globals.ts';
import { Location } from '@angular/common';

@Component({
  providers: [ ],
  templateUrl: 'help.template.html',
})
export class HelpPage {

  private currentSection: string = "overview";
  private currentUrl: string = "/help/overview";
  private baseUrl: string = "/help/";
  private currentSubSection: string = "";
  private widthLimit: number = 1200;


  @ViewChild("feedback") feedback;


  constructor(private router: Router, private location:Location) {}

  ngOnInit(){

    this.router.events.subscribe(
      val => {
        if(!(val instanceof  NavigationCancel)){
          this.currentUrl = val.url.indexOf("#") > 0? val.url.substr(0,val.url.indexOf("#")):val.url;
          this.currentUrl = this.currentUrl.indexOf("?") > 0? this.currentUrl.substr(0,this.currentUrl.indexOf("?")):this.currentUrl;

          let section = this.currentUrl.substr(this.baseUrl.length);
          section = section.length === 0? 'overview':section;
          this.currentSection = section;
        }else{
          this.currentSection = this.location.path(false).substr(this.baseUrl.length);
        }

      });

  }

  changeSection(value){
    window.scrollTo(0,0);
    this.currentSection = value;
    this.currentUrl = this.baseUrl+this.currentSection;
    this.currentSubSection = "";
  }

  getSectionClass(value){
    return this.isCurrentSection(value)? "usa-current":"";
  }

  isCurrentSection(value){
    return this.currentSection === value;
  }

  changeSubSection(value,elem){
    this.currentSubSection = value;
    if(window.innerWidth>this.widthLimit){
      setTimeout(()=>{
        elem.focus();
      });
    }
  }

  getSubSectionClass(value){
    return this.isCurrentSubSection(value)? "usa-current":"";
  }

  isCurrentSubSection(value){
    return this.currentSubSection === value;
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }

}
