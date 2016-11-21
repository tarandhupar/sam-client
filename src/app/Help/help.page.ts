import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  providers: [ ],
  styleUrls: ['help.style.css'],
  templateUrl: 'help.template.html',
})
export class HelpPage {

  private currentSection: string = "overview";
  private currentUrl: string = "/help/overview";
  private baseUrl: string = "/help/";
  private currentSubSection: string = "";
  private widthLimit: number = 1200;

  constructor(private router: Router) {
    //router.navigateByUrl('help/overview');

  }

  ngOnInit(){
    this.router.events.subscribe(
      val => {
        if(val.url.indexOf("#") > 0){
          this.currentUrl = val.url.substr(0,val.url.indexOf("#"));
        }else{
          this.currentUrl = val.url;
        }
        let section = this.currentUrl.substr(this.baseUrl.length);
        section = section.length === 0? 'overview':section;
        this.currentSection = section;
      });
  }

  changeSection(value){
    this.currentSection = value;
    this.currentUrl = this.baseUrl+this.currentSection;
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

}
