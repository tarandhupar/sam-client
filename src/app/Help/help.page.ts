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
  private baseUrl: string = "/help";
  private currentSubSection: string = "";

  constructor(router: Router) {
    //router.navigateByUrl('help/overview');
  }

  changeSection(value){
    this.currentSection = value;
    this.currentUrl = this.baseUrl+"/"+this.currentSection;
  }

  getSectionClass(value){
    return this.isCurrentSection(value)? "usa-current":"";
  }

  isCurrentSection(value){
    return this.currentSection === value;
  }

  changeSubSection(value){
    this.currentSubSection = value;
  }

  getSubSectionClass(value){
    return this.isCurrentSubSection(value)? "usa-current":"";
  }

  isCurrentSubSection(value){
    return this.currentSubSection === value;
  }

}
